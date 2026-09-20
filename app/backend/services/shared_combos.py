import logging
from typing import Optional, Dict, Any, List

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from models.shared_combos import Shared_combos

logger = logging.getLogger(__name__)


# ------------------ Service Layer ------------------
class Shared_combosService:
    """Service layer for Shared_combos operations"""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, data: Dict[str, Any]) -> Optional[Shared_combos]:
        """Create a new shared_combos"""
        try:
            obj = Shared_combos(**data)
            self.db.add(obj)
            await self.db.commit()
            await self.db.refresh(obj)
            logger.info(f"Created shared_combos with id: {obj.id}")
            return obj
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error creating shared_combos: {str(e)}")
            raise

    async def get_by_id(self, obj_id: int) -> Optional[Shared_combos]:
        """Get shared_combos by ID"""
        try:
            query = select(Shared_combos).where(Shared_combos.id == obj_id)
            result = await self.db.execute(query)
            return result.scalar_one_or_none()
        except Exception as e:
            logger.error(f"Error fetching shared_combos {obj_id}: {str(e)}")
            raise

    async def get_list(
        self, 
        skip: int = 0, 
        limit: int = 20, 
        query_dict: Optional[Dict[str, Any]] = None,
        sort: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Get paginated list of shared_comboss"""
        try:
            query = select(Shared_combos)
            count_query = select(func.count(Shared_combos.id))
            
            if query_dict:
                for field, value in query_dict.items():
                    if hasattr(Shared_combos, field):
                        query = query.where(getattr(Shared_combos, field) == value)
                        count_query = count_query.where(getattr(Shared_combos, field) == value)
            
            count_result = await self.db.execute(count_query)
            total = count_result.scalar()

            if sort:
                if sort.startswith('-'):
                    field_name = sort[1:]
                    if hasattr(Shared_combos, field_name):
                        query = query.order_by(getattr(Shared_combos, field_name).desc())
                else:
                    if hasattr(Shared_combos, sort):
                        query = query.order_by(getattr(Shared_combos, sort))
            else:
                query = query.order_by(Shared_combos.id.desc())

            result = await self.db.execute(query.offset(skip).limit(limit))
            items = result.scalars().all()

            return {
                "items": items,
                "total": total,
                "skip": skip,
                "limit": limit,
            }
        except Exception as e:
            logger.error(f"Error fetching shared_combos list: {str(e)}")
            raise

    async def update(self, obj_id: int, update_data: Dict[str, Any]) -> Optional[Shared_combos]:
        """Update shared_combos"""
        try:
            obj = await self.get_by_id(obj_id)
            if not obj:
                logger.warning(f"Shared_combos {obj_id} not found for update")
                return None
            for key, value in update_data.items():
                if hasattr(obj, key):
                    setattr(obj, key, value)

            await self.db.commit()
            await self.db.refresh(obj)
            logger.info(f"Updated shared_combos {obj_id}")
            return obj
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error updating shared_combos {obj_id}: {str(e)}")
            raise

    async def delete(self, obj_id: int) -> bool:
        """Delete shared_combos"""
        try:
            obj = await self.get_by_id(obj_id)
            if not obj:
                logger.warning(f"Shared_combos {obj_id} not found for deletion")
                return False
            await self.db.delete(obj)
            await self.db.commit()
            logger.info(f"Deleted shared_combos {obj_id}")
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error deleting shared_combos {obj_id}: {str(e)}")
            raise

    async def get_by_field(self, field_name: str, field_value: Any) -> Optional[Shared_combos]:
        """Get shared_combos by any field"""
        try:
            if not hasattr(Shared_combos, field_name):
                raise ValueError(f"Field {field_name} does not exist on Shared_combos")
            result = await self.db.execute(
                select(Shared_combos).where(getattr(Shared_combos, field_name) == field_value)
            )
            return result.scalar_one_or_none()
        except Exception as e:
            logger.error(f"Error fetching shared_combos by {field_name}: {str(e)}")
            raise

    async def list_by_field(
        self, field_name: str, field_value: Any, skip: int = 0, limit: int = 20
    ) -> List[Shared_combos]:
        """Get list of shared_comboss filtered by field"""
        try:
            if not hasattr(Shared_combos, field_name):
                raise ValueError(f"Field {field_name} does not exist on Shared_combos")
            result = await self.db.execute(
                select(Shared_combos)
                .where(getattr(Shared_combos, field_name) == field_value)
                .offset(skip)
                .limit(limit)
                .order_by(Shared_combos.id.desc())
            )
            return result.scalars().all()
        except Exception as e:
            logger.error(f"Error fetching shared_comboss by {field_name}: {str(e)}")
            raise