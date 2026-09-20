import json
import logging
from typing import List, Optional

from datetime import datetime, date

from fastapi import APIRouter, Body, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db
from services.shared_combos import Shared_combosService

# Set up logging
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/entities/shared_combos", tags=["shared_combos"])


# ---------- Pydantic Schemas ----------
class Shared_combosData(BaseModel):
    """Entity data schema (for create/update)"""
    share_id: str
    name: str
    moves: str
    instructor_name: str = None
    description: str = None


class Shared_combosUpdateData(BaseModel):
    """Update entity data (partial updates allowed)"""
    share_id: Optional[str] = None
    name: Optional[str] = None
    moves: Optional[str] = None
    instructor_name: Optional[str] = None
    description: Optional[str] = None


class Shared_combosResponse(BaseModel):
    """Entity response schema"""
    id: int
    share_id: str
    name: str
    moves: str
    instructor_name: Optional[str] = None
    description: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class Shared_combosListResponse(BaseModel):
    """List response schema"""
    items: List[Shared_combosResponse]
    total: int
    skip: int
    limit: int


class Shared_combosBatchCreateRequest(BaseModel):
    """Batch create request"""
    items: List[Shared_combosData]


class Shared_combosBatchUpdateItem(BaseModel):
    """Batch update item"""
    id: int
    updates: Shared_combosUpdateData


class Shared_combosBatchUpdateRequest(BaseModel):
    """Batch update request"""
    items: List[Shared_combosBatchUpdateItem]


class Shared_combosBatchDeleteRequest(BaseModel):
    """Batch delete request"""
    ids: List[int]


# ---------- Routes ----------
@router.get("/share/{share_id}", response_model=Shared_combosResponse)
async def get_shared_combo_by_share_id(
    share_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Get a shared combo by its unique share_id (public access)"""
    logger.debug(f"Fetching shared combo with share_id: {share_id}")
    
    service = Shared_combosService(db)
    try:
        result = await service.get_by_field("share_id", share_id)
        if not result:
            logger.warning(f"Shared combo with share_id {share_id} not found")
            raise HTTPException(status_code=404, detail="Shared combo not found")
        
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching shared combo by share_id {share_id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("", response_model=Shared_combosListResponse)
async def query_shared_comboss(
    query: str = Query(None, description="Query conditions (JSON string)"),
    sort: str = Query(None, description="Sort field (prefix with '-' for descending)"),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(20, ge=1, le=2000, description="Max number of records to return"),
    fields: str = Query(None, description="Comma-separated list of fields to return"),
    db: AsyncSession = Depends(get_db),
):
    """Query shared_comboss with filtering, sorting, and pagination"""
    logger.debug(f"Querying shared_comboss: query={query}, sort={sort}, skip={skip}, limit={limit}, fields={fields}")
    
    service = Shared_combosService(db)
    try:
        # Parse query JSON if provided
        query_dict = None
        if query:
            try:
                query_dict = json.loads(query)
            except json.JSONDecodeError:
                raise HTTPException(status_code=400, detail="Invalid query JSON format")
        
        result = await service.get_list(
            skip=skip, 
            limit=limit,
            query_dict=query_dict,
            sort=sort,
        )
        logger.debug(f"Found {result['total']} shared_comboss")
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error querying shared_comboss: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/all", response_model=Shared_combosListResponse)
async def query_shared_comboss_all(
    query: str = Query(None, description="Query conditions (JSON string)"),
    sort: str = Query(None, description="Sort field (prefix with '-' for descending)"),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(20, ge=1, le=2000, description="Max number of records to return"),
    fields: str = Query(None, description="Comma-separated list of fields to return"),
    db: AsyncSession = Depends(get_db),
):
    # Query shared_comboss with filtering, sorting, and pagination without user limitation
    logger.debug(f"Querying shared_comboss: query={query}, sort={sort}, skip={skip}, limit={limit}, fields={fields}")

    service = Shared_combosService(db)
    try:
        # Parse query JSON if provided
        query_dict = None
        if query:
            try:
                query_dict = json.loads(query)
            except json.JSONDecodeError:
                raise HTTPException(status_code=400, detail="Invalid query JSON format")

        result = await service.get_list(
            skip=skip,
            limit=limit,
            query_dict=query_dict,
            sort=sort
        )
        logger.debug(f"Found {result['total']} shared_comboss")
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error querying shared_comboss: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/{id}", response_model=Shared_combosResponse)
async def get_shared_combos(
    id: int,
    fields: str = Query(None, description="Comma-separated list of fields to return"),
    db: AsyncSession = Depends(get_db),
):
    """Get a single shared_combos by ID"""
    logger.debug(f"Fetching shared_combos with id: {id}, fields={fields}")
    
    service = Shared_combosService(db)
    try:
        result = await service.get_by_id(id)
        if not result:
            logger.warning(f"Shared_combos with id {id} not found")
            raise HTTPException(status_code=404, detail="Shared_combos not found")
        
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching shared_combos {id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.post("", response_model=Shared_combosResponse, status_code=201)
async def create_shared_combos(
    data: Shared_combosData,
    db: AsyncSession = Depends(get_db),
):
    """Create a new shared_combos"""
    logger.debug(f"Creating new shared_combos with data: {data}")
    
    service = Shared_combosService(db)
    try:
        result = await service.create(data.model_dump())
        if not result:
            raise HTTPException(status_code=400, detail="Failed to create shared_combos")
        
        logger.info(f"Shared_combos created successfully with id: {result.id}")
        return result
    except ValueError as e:
        logger.error(f"Validation error creating shared_combos: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error creating shared_combos: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.post("/batch", response_model=List[Shared_combosResponse], status_code=201)
async def create_shared_comboss_batch(
    request: Shared_combosBatchCreateRequest,
    db: AsyncSession = Depends(get_db),
):
    """Create multiple shared_comboss in a single request"""
    logger.debug(f"Batch creating {len(request.items)} shared_comboss")
    
    service = Shared_combosService(db)
    results = []
    
    try:
        for item_data in request.items:
            result = await service.create(item_data.model_dump())
            if result:
                results.append(result)
        
        logger.info(f"Batch created {len(results)} shared_comboss successfully")
        return results
    except Exception as e:
        await db.rollback()
        logger.error(f"Error in batch create: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Batch create failed: {str(e)}")


@router.put("/batch", response_model=List[Shared_combosResponse])
async def update_shared_comboss_batch(
    request: Shared_combosBatchUpdateRequest,
    db: AsyncSession = Depends(get_db),
):
    """Update multiple shared_comboss in a single request"""
    logger.debug(f"Batch updating {len(request.items)} shared_comboss")
    
    service = Shared_combosService(db)
    results = []
    
    try:
        for item in request.items:
            # Only include non-None values for partial updates
            update_dict = {k: v for k, v in item.updates.model_dump().items() if v is not None}
            result = await service.update(item.id, update_dict)
            if result:
                results.append(result)
        
        logger.info(f"Batch updated {len(results)} shared_comboss successfully")
        return results
    except Exception as e:
        await db.rollback()
        logger.error(f"Error in batch update: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Batch update failed: {str(e)}")


@router.put("/{id}", response_model=Shared_combosResponse)
async def update_shared_combos(
    id: int,
    data: Shared_combosUpdateData,
    db: AsyncSession = Depends(get_db),
):
    """Update an existing shared_combos"""
    logger.debug(f"Updating shared_combos {id} with data: {data}")

    service = Shared_combosService(db)
    try:
        # Only include non-None values for partial updates
        update_dict = {k: v for k, v in data.model_dump().items() if v is not None}
        result = await service.update(id, update_dict)
        if not result:
            logger.warning(f"Shared_combos with id {id} not found for update")
            raise HTTPException(status_code=404, detail="Shared_combos not found")
        
        logger.info(f"Shared_combos {id} updated successfully")
        return result
    except HTTPException:
        raise
    except ValueError as e:
        logger.error(f"Validation error updating shared_combos {id}: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error updating shared_combos {id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.delete("/batch")
async def delete_shared_comboss_batch(
    request: Shared_combosBatchDeleteRequest,
    db: AsyncSession = Depends(get_db),
):
    """Delete multiple shared_comboss by their IDs"""
    logger.debug(f"Batch deleting {len(request.ids)} shared_comboss")
    
    service = Shared_combosService(db)
    deleted_count = 0
    
    try:
        for item_id in request.ids:
            success = await service.delete(item_id)
            if success:
                deleted_count += 1
        
        logger.info(f"Batch deleted {deleted_count} shared_comboss successfully")
        return {"message": f"Successfully deleted {deleted_count} shared_comboss", "deleted_count": deleted_count}
    except Exception as e:
        await db.rollback()
        logger.error(f"Error in batch delete: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Batch delete failed: {str(e)}")


@router.delete("/{id}")
async def delete_shared_combos(
    id: int,
    db: AsyncSession = Depends(get_db),
):
    """Delete a single shared_combos by ID"""
    logger.debug(f"Deleting shared_combos with id: {id}")
    
    service = Shared_combosService(db)
    try:
        success = await service.delete(id)
        if not success:
            logger.warning(f"Shared_combos with id {id} not found for deletion")
            raise HTTPException(status_code=404, detail="Shared_combos not found")
        
        logger.info(f"Shared_combos {id} deleted successfully")
        return {"message": "Shared_combos deleted successfully", "id": id}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting shared_combos {id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")