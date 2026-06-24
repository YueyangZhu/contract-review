from pydantic import BaseModel
from datetime import datetime
from app.models.approval import ApprovalDecision


class ApprovalCreate(BaseModel):
    decision: ApprovalDecision
    comment: str = ""


class ApprovalOut(BaseModel):
    id: str
    contract_id: str
    approver_id: str
    step: int
    decision: ApprovalDecision
    comment: str
    created_at: datetime

    class Config:
        from_attributes = True
