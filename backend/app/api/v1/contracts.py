import os
import uuid
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload
from app.db.session import get_db
from app.api.deps import get_current_user
from app.models import Contract, ContractStatus, User, Review
from app.schemas.contract import ContractOut, ContractDetail
from app.services.workflow import run_ai_review, archive_contract
from app.core.config import get_settings

router = APIRouter(prefix="/contracts", tags=["合同"])

settings = get_settings()
UPLOAD_DIR = settings.upload_dir
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.get("", response_model=list[ContractOut])
def list_contracts(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    stmt = (
        select(Contract)
        .options(joinedload(Contract.review).joinedload(Review.risks))
        .order_by(Contract.created_at.desc())
    )
    return db.execute(stmt).unique().scalars().all()


@router.post("/upload", response_model=ContractOut)
async def upload_contract(
    title: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in (".txt", ".docx", ".pdf"):
        raise HTTPException(status_code=400, detail="仅支持 txt/docx/pdf 文件")

    safe_name = f"{uuid.uuid4().hex}{ext}"
    file_path = os.path.join(UPLOAD_DIR, safe_name)

    with open(file_path, "wb") as f:
        f.write(await file.read())

    contract = Contract(
        title=title or file.filename,
        file_name=file.filename,
        file_path=file_path,
        file_type=ext.lstrip("."),
        file_size=os.path.getsize(file_path),
        uploader_id=current_user.id,
    )
    db.add(contract)
    db.commit()
    db.refresh(contract)
    return contract


@router.get("/{contract_id}", response_model=ContractDetail)
def get_contract(contract_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    stmt = (
        select(Contract)
        .options(joinedload(Contract.review).joinedload(Review.risks))
        .where(Contract.id == contract_id)
    )
    contract = db.execute(stmt).unique().scalars().first()
    if not contract:
        raise HTTPException(status_code=404, detail="合同不存在")
    return contract


@router.post("/{contract_id}/review", response_model=dict)
async def review_contract_endpoint(
    contract_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    contract = db.query(Contract).filter(Contract.id == contract_id).first()
    if not contract:
        raise HTTPException(status_code=404, detail="合同不存在")
    if contract.status not in (ContractStatus.uploaded, ContractStatus.review_done):
        raise HTTPException(status_code=400, detail="当前状态不允许发起审核")

    review = await run_ai_review(db, contract)
    return {"review_id": review.id, "status": contract.status.value}


@router.post("/{contract_id}/archive", response_model=ContractOut)
def archive_contract_endpoint(
    contract_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    contract = db.query(Contract).filter(Contract.id == contract_id).first()
    if not contract:
        raise HTTPException(status_code=404, detail="合同不存在")
    try:
        archive_contract(db, contract)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return contract
