from pydantic import BaseModel
from datetime import datetime
from typing import List
from app.models.risk import RiskLevel


class RiskOut(BaseModel):
    id: str
    clause: str
    start_index: int
    end_index: int
    level: RiskLevel
    category: str
    description: str
    suggestion: str

    class Config:
        from_attributes = True


class ReviewOut(BaseModel):
    id: str
    contract_id: str
    score: float
    summary: str
    status: str
    created_at: datetime
    risks: List[RiskOut]

    class Config:
        from_attributes = True
