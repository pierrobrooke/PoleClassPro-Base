from pydantic import BaseModel
from typing import List, Optional


class NotionMoveResponse(BaseModel):
    id: str
    name: str = ""
    level: str = ""
    category: str = ""
    pole_type: str = ""
    body_position: str = ""
    grip_type: str = ""
    muscle_groups: List[str] = []
    prerequisites: str = ""
    tags: List[str] = []
    is_combo_starter: bool = False
    notes_teaching_tips: str = ""
    instagram_link: str = ""
    instagram_search: str = ""
    video_reference: str = ""
    taught_yet: bool = False


class NotionSyncResponse(BaseModel):
    success: bool
    moves: List[NotionMoveResponse] = []
    total_count: int = 0
    message: str = ""


class NotionStatusResponse(BaseModel):
    connected: bool
    database_id: str = ""
    message: str = ""