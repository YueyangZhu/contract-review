from pydantic import BaseModel
from datetime import datetime


class AnnotationCreate(BaseModel):
    quote: str
    content: str
    start_index: int
    end_index: int


class AnnotationOut(AnnotationCreate):
    id: str
    contract_id: str
    user_id: str
    created_at: datetime

    class Config:
        from_attributes = True
