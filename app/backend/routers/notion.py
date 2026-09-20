import logging
from fastapi import APIRouter, Depends

from dependencies.auth import get_current_user
from schemas.auth import UserResponse
from schemas.notion import NotionSyncResponse, NotionStatusResponse
from services.notion_sync import fetch_all_moves, check_connection, get_cached_moves, get_sync_status

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/notion", tags=["notion"])


@router.get("/moves", response_model=NotionSyncResponse)
async def get_moves():
    """Get all pole moves from the cache (auto-synced from Notion in the background). Public endpoint."""
    result = await fetch_all_moves()
    return NotionSyncResponse(
        success=result["success"],
        moves=result["moves"],
        total_count=result["total_count"],
        message=result["message"],
    )


@router.post("/sync-moves", response_model=NotionSyncResponse)
async def sync_moves(
    current_user: UserResponse = Depends(get_current_user),
):
    """Manually trigger a sync from Notion (admin use)."""
    result = await fetch_all_moves()
    return NotionSyncResponse(
        success=result["success"],
        moves=result["moves"],
        total_count=result["total_count"],
        message=result["message"],
    )


@router.get("/status", response_model=NotionStatusResponse)
async def get_status(
    current_user: UserResponse = Depends(get_current_user),
):
    """Check Notion API connection status."""
    result = await check_connection()
    return NotionStatusResponse(
        connected=result["connected"],
        database_id=result["database_id"],
        message=result["message"],
    )