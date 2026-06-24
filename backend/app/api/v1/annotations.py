from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.deps import get_current_user
from app.models import Contract, User
from app.schemas.annotation import AnnotationCreate, AnnotationOut
from app.services.workflow import submit_annotation

router = APIRouter(prefix="/contracts/{contract_id}/annotations", tags=["批注"])


@router.post("", response_model=AnnotationOut)
def create_annotation(
    contract_id: str,
    payload: AnnotationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    contract = db.query(Contract).filter(Contract.id == contract_id).first()
    if not contract:
        raise HTTPException(status_code=404, detail="合同不存在")
    return submit_annotation(
        db, contract, current_user,
        payload.quote, payload.content,
        payload.start_index, payload.end_index,
    )
