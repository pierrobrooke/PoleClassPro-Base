from core.database import Base
from datetime import datetime
from sqlalchemy import Column, DateTime, Integer, String


class Shared_combos(Base):
    __tablename__ = "shared_combos"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    share_id = Column(String, nullable=False)
    name = Column(String, nullable=False)
    moves = Column(String, nullable=False)
    instructor_name = Column(String, nullable=True)
    description = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), default=datetime.now)
    updated_at = Column(DateTime(timezone=True), default=datetime.now, onupdate=datetime.now)