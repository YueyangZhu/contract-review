from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.deps import get_current_user
from app.models import Contract, User, ApprovalDecision
from app.schemas.approval import ApprovalCreate, ApprovalOut
from app.services.workflow import submit_approval

router = APIRouter(prefix="/contracts/{contract_id}/approvals", tags=["审批"])


@router.post("", response_model=ApprovalOut)
def create_approval(
    contract_id: str,
    payload: ApprovalCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    contract = db.query(Contract).filter(Contract.id == contract_id).first()
    if not contract:
        raise HTTPException(status_code=404, detail="合同不存在")
    return submit_approval(db, contract, current_user, payload.decision, payload.comment)
