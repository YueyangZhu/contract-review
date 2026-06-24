from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from app.models.contract import ContractStatus
from app.schemas.review import ReviewOut


class ContractBase(BaseModel):
    title: str


class ContractCreate(ContractBase):
    pass


class ContractOut(ContractBase):
    id: str
    file_name: str
    file_type: str
    file_size: int
    status: ContractStatus
    uploader_id: str
    created_at: datetime
    updated_at: datetime
    review: Optional[ReviewOut] = None

    class Config:
        from_attributes = True


class ContractDetail(ContractOut):
    content: str
