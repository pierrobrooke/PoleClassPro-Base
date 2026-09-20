import os
import logging
import asyncio
from typing import List, Dict, Any

import httpx

logger = logging.getLogger(__name__)

NOTION_API_BASE = "https://api.notion.com/v1"
NOTION_VERSION = "2022-06-28"
DATABASE_ID = "95d2120ab15542c2bdace376ab3eb89f"

# In-memory cache for synced moves
_cached_moves: List[Dict[str, Any]] = []
_last_sync_success: bool = False
_last_sync_message: str = "Not synced yet"
_sync_lock = asyncio.Lock()

# Auto-sync interval in seconds (5 minutes)
AUTO_SYNC_INTERVAL = 300


def _get_headers() -> Dict[str, str]:
    api_key = os.environ.get("NOTION_API_KEY", "")
    return {
        "Authorization": f"Bearer {api_key}",
        "Notion-Version": NOTION_VERSION,
        "Content-Type": "application/json",
    }


def _extract_title(prop: Dict[str, Any]) -> str:
    """Extract plain text from a title property."""
    title_items = prop.get("title", [])
    return "".join(item.get("plain_text", "") for item in title_items)


def _extract_rich_text(prop: Dict[str, Any]) -> str:
    """Extract plain text from a rich_text property."""
    text_items = prop.get("rich_text", [])
    return "".join(item.get("plain_text", "") for item in text_items)


def _extract_select(prop: Dict[str, Any]) -> str:
    """Extract name from a select property."""
    select_val = prop.get("select")
    if select_val:
        return select_val.get("name", "")
    return ""


def _extract_multi_select(prop: Dict[str, Any]) -> List[str]:
    """Extract list of names from a multi_select property."""
    items = prop.get("multi_select", [])
    return [item.get("name", "") for item in items if item.get("name")]


def _extract_checkbox(prop: Dict[str, Any]) -> bool:
    """Extract boolean from a checkbox property."""
    return bool(prop.get("checkbox", False))


def _extract_url(prop: Dict[str, Any]) -> str:
    """Extract URL string from a url property."""
    return prop.get("url", "") or ""


def _extract_property_value(prop: Dict[str, Any]) -> Any:
    """Extract value from any Notion property based on its type."""
    prop_type = prop.get("type", "")

    if prop_type == "title":
        return _extract_title(prop)
    elif prop_type == "rich_text":
        return _extract_rich_text(prop)
    elif prop_type == "select":
        return _extract_select(prop)
    elif prop_type == "multi_select":
        return _extract_multi_select(prop)
    elif prop_type == "checkbox":
        return _extract_checkbox(prop)
    elif prop_type == "url":
        return _extract_url(prop)
    elif prop_type == "number":
        val = prop.get("number")
        return val if val is not None else ""
    elif prop_type == "date":
        date_val = prop.get("date")
        if date_val:
            return date_val.get("start", "")
        return ""
    elif prop_type == "formula":
        formula_val = prop.get("formula", {})
        formula_type = formula_val.get("type", "")
        if formula_type == "string":
            return formula_val.get("string", "") or ""
        elif formula_type == "number":
            return formula_val.get("number", "")
        elif formula_type == "boolean":
            return formula_val.get("boolean", False)
        return ""
    elif prop_type == "rollup":
        rollup_val = prop.get("rollup", {})
        rollup_type = rollup_val.get("type", "")
        if rollup_type == "array":
            arr = rollup_val.get("array", [])
            results = []
            for item in arr:
                results.append(_extract_property_value(item))
            return results
        return ""
    else:
        return ""


def _map_page_to_move(page: Dict[str, Any]) -> Dict[str, Any]:
    """Map a Notion page to our move structure with ALL properties."""
    props = page.get("properties", {})
    page_id = page.get("id", "")

    move: Dict[str, Any] = {
        "id": page_id,
        "name": "",
        "level": "",
        "category": "",
        "pole_type": "",
        "body_position": "",
        "grip_type": "",
        "muscle_groups": [],
        "prerequisites": "",
        "tags": [],
        "is_combo_starter": False,
        "notes_teaching_tips": "",
        "instagram_link": "",
        "instagram_search": "",
        "video_reference": "",
        "taught_yet": False,
    }

    # Map property names (case-insensitive) to our fields
    for key, value in props.items():
        key_lower = key.lower().strip()
        prop_type = value.get("type", "")

        if key_lower in ("move name", "name", "title", "move", "trick", "trick name"):
            move["name"] = _extract_title(value) if prop_type == "title" else _extract_rich_text(value)

        elif key_lower == "level":
            if prop_type == "select":
                move["level"] = _extract_select(value)
            elif prop_type == "multi_select":
                items = _extract_multi_select(value)
                move["level"] = items[0] if items else ""
            else:
                move["level"] = _extract_rich_text(value)

        elif key_lower == "category":
            if prop_type == "select":
                move["category"] = _extract_select(value)
            elif prop_type == "multi_select":
                items = _extract_multi_select(value)
                move["category"] = items[0] if items else ""
            else:
                move["category"] = _extract_rich_text(value)

        elif key_lower in ("pole type", "pole"):
            if prop_type == "select":
                move["pole_type"] = _extract_select(value)
            elif prop_type == "multi_select":
                items = _extract_multi_select(value)
                move["pole_type"] = ", ".join(items)
            else:
                move["pole_type"] = _extract_rich_text(value)

        elif key_lower in ("body position", "position"):
            if prop_type == "select":
                move["body_position"] = _extract_select(value)
            elif prop_type == "multi_select":
                items = _extract_multi_select(value)
                move["body_position"] = ", ".join(items)
            else:
                move["body_position"] = _extract_rich_text(value)

        elif key_lower in ("grip type", "grip"):
            if prop_type == "select":
                move["grip_type"] = _extract_select(value)
            elif prop_type == "multi_select":
                items = _extract_multi_select(value)
                move["grip_type"] = ", ".join(items)
            else:
                move["grip_type"] = _extract_rich_text(value)

        elif key_lower in ("muscle groups", "muscles", "muscle group", "target muscles"):
            if prop_type == "multi_select":
                move["muscle_groups"] = _extract_multi_select(value)
            elif prop_type == "rich_text":
                text = _extract_rich_text(value)
                if text:
                    move["muscle_groups"] = [s.strip() for s in text.split(",") if s.strip()]

        elif key_lower in ("prerequisites", "prereqs", "pre-requisites", "required moves"):
            if prop_type == "rich_text":
                move["prerequisites"] = _extract_rich_text(value)
            elif prop_type == "multi_select":
                items = _extract_multi_select(value)
                move["prerequisites"] = ", ".join(items)
            else:
                move["prerequisites"] = str(_extract_property_value(value))

        elif key_lower == "tags":
            if prop_type == "multi_select":
                move["tags"] = _extract_multi_select(value)
            elif prop_type == "rich_text":
                text = _extract_rich_text(value)
                if text:
                    move["tags"] = [s.strip() for s in text.split(",") if s.strip()]

        elif key_lower in ("is combo starter", "combo starter"):
            if prop_type == "checkbox":
                move["is_combo_starter"] = _extract_checkbox(value)

        elif key_lower in ("notes/teaching tips", "notes", "teaching tips", "notes / teaching tips"):
            if prop_type == "rich_text":
                move["notes_teaching_tips"] = _extract_rich_text(value)
            else:
                move["notes_teaching_tips"] = str(_extract_property_value(value))

        elif key_lower in ("instagram link", "instagram url", "instagram"):
            if prop_type == "url":
                move["instagram_link"] = _extract_url(value)
            else:
                move["instagram_link"] = _extract_rich_text(value)

        elif key_lower in ("instagram search", "ig search"):
            if prop_type == "url":
                move["instagram_search"] = _extract_url(value)
            elif prop_type == "rich_text":
                move["instagram_search"] = _extract_rich_text(value)
            else:
                move["instagram_search"] = str(_extract_property_value(value))

        elif key_lower in ("video reference", "video", "video link", "video url"):
            if prop_type == "url":
                move["video_reference"] = _extract_url(value)
            else:
                move["video_reference"] = _extract_rich_text(value)

        elif key_lower in ("taught yet", "taught", "has been taught"):
            if prop_type == "checkbox":
                move["taught_yet"] = _extract_checkbox(value)

    return move


async def _do_sync() -> Dict[str, Any]:
    """Internal sync logic - fetches all moves from Notion."""
    all_moves: List[Dict[str, Any]] = []
    has_more = True
    next_cursor = None

    headers = _get_headers()

    if not headers["Authorization"].replace("Bearer ", ""):
        return {
            "success": False,
            "moves": [],
            "total_count": 0,
            "message": "NOTION_API_KEY not configured",
        }

    async with httpx.AsyncClient(timeout=30.0) as client:
        while has_more:
            payload: Dict[str, Any] = {"page_size": 100}
            if next_cursor:
                payload["start_cursor"] = next_cursor

            try:
                response = await client.post(
                    f"{NOTION_API_BASE}/databases/{DATABASE_ID}/query",
                    headers=headers,
                    json=payload,
                )
                response.raise_for_status()
                data = response.json()

                results = data.get("results", [])
                for page in results:
                    move = _map_page_to_move(page)
                    if move["name"]:
                        all_moves.append(move)

                has_more = data.get("has_more", False)
                next_cursor = data.get("next_cursor")

            except httpx.HTTPStatusError as e:
                logger.error(f"Notion API HTTP error: {e.response.status_code} - {e.response.text}")
                return {
                    "success": False,
                    "moves": all_moves,
                    "total_count": len(all_moves),
                    "message": f"Notion API error: {e.response.status_code}",
                }
            except httpx.RequestError as e:
                logger.error(f"Notion API request error: {e}")
                return {
                    "success": False,
                    "moves": all_moves,
                    "total_count": len(all_moves),
                    "message": f"Connection error: {str(e)}",
                }

    return {
        "success": True,
        "moves": all_moves,
        "total_count": len(all_moves),
        "message": f"Successfully synced {len(all_moves)} moves from Notion",
    }


async def sync_moves_background() -> None:
    """Background task to sync moves from Notion and update cache."""
    global _cached_moves, _last_sync_success, _last_sync_message

    async with _sync_lock:
        logger.info("Starting background Notion sync...")
        result = await _do_sync()
        _last_sync_success = result["success"]
        _last_sync_message = result["message"]
        if result["success"] and result["moves"]:
            _cached_moves = result["moves"]
            logger.info(f"Background sync complete: {len(_cached_moves)} moves cached")
        elif not result["success"]:
            logger.warning(f"Background sync failed: {_last_sync_message}")


async def start_auto_sync() -> None:
    """Start the background auto-sync loop. Call this on app startup."""
    # Do an initial sync immediately
    await sync_moves_background()

    # Then schedule periodic syncs
    async def _loop():
        while True:
            await asyncio.sleep(AUTO_SYNC_INTERVAL)
            await sync_moves_background()

    asyncio.create_task(_loop())


async def fetch_all_moves() -> Dict[str, Any]:
    """Return cached moves if available, otherwise do a fresh sync."""
    global _cached_moves, _last_sync_success, _last_sync_message

    if _cached_moves:
        return {
            "success": True,
            "moves": _cached_moves,
            "total_count": len(_cached_moves),
            "message": f"Serving {len(_cached_moves)} cached moves",
        }

    # No cache yet, do a fresh sync
    await sync_moves_background()

    if _cached_moves:
        return {
            "success": True,
            "moves": _cached_moves,
            "total_count": len(_cached_moves),
            "message": _last_sync_message,
        }

    return {
        "success": _last_sync_success,
        "moves": [],
        "total_count": 0,
        "message": _last_sync_message,
    }


async def check_connection() -> Dict[str, Any]:
    """Check if the Notion API connection is working."""
    headers = _get_headers()

    if not headers["Authorization"].replace("Bearer ", ""):
        return {
            "connected": False,
            "database_id": DATABASE_ID,
            "message": "NOTION_API_KEY not configured",
        }

    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            response = await client.get(
                f"{NOTION_API_BASE}/databases/{DATABASE_ID}",
                headers=headers,
            )
            response.raise_for_status()
            data = response.json()
            db_title = ""
            title_items = data.get("title", [])
            if title_items:
                db_title = title_items[0].get("plain_text", "")

            return {
                "connected": True,
                "database_id": DATABASE_ID,
                "message": f"Connected to database: {db_title}" if db_title else "Connected successfully",
            }
        except httpx.HTTPStatusError as e:
            return {
                "connected": False,
                "database_id": DATABASE_ID,
                "message": f"API error: {e.response.status_code} - Check your integration permissions",
            }
        except httpx.RequestError as e:
            return {
                "connected": False,
                "database_id": DATABASE_ID,
                "message": f"Connection failed: {str(e)}",
            }


def get_cached_moves() -> List[Dict[str, Any]]:
    """Get the current cached moves without triggering a sync."""
    return _cached_moves


def get_sync_status() -> Dict[str, Any]:
    """Get the current sync status."""
    return {
        "connected": _last_sync_success,
        "cached_count": len(_cached_moves),
        "message": _last_sync_message,
    }