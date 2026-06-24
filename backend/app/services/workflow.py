from typing import Optional
from sqlalchemy.orm import Session
from app.models import Contract, ContractStatus, Review, Risk, Annotation, Approval, ApprovalDecision, User
from app.services.parser import parse_contract
from app.services.llm import review_contract


async def run_ai_review(db: Session, contract: Contract) -> Review:
    contract.status = ContractStatus.reviewing
    db.commit()

    try:
        content = await parse_contract(contract.file_path, contract.file_type)
        contract.content = content
        db.commit()

        result = await review_contract(content)

        review = Review(
            contract_id=contract.id,
            score=result["score"],
            summary=result["summary"],
            status="completed",
        )
        db.add(review)
        db.flush()

        for r in result["risks"]:
            risk = Risk(
                review_id=review.id,
                clause=r["clause"],
                start_index=r.get("start_index", 0),
                end_index=r.get("end_index", 0),
                level=r["level"],
                category=r["category"],
                description=r["description"],
                suggestion=r["suggestion"],
            )
            db.add(risk)

        contract.status = ContractStatus.review_done
        db.commit()
        db.refresh(review)
        return review
    except Exception as e:
        contract.status = ContractStatus.uploaded
        db.commit()
        raise e


def submit_annotation(db: Session, contract: Contract, user: User, quote: str, content: str, start: int, end: int) -> Annotation:
    annotation = Annotation(
        contract_id=contract.id,
        user_id=user.id,
        quote=quote,
        content=content,
        start_index=start,
        end_index=end,
    )
    db.add(annotation)
    if contract.status in (ContractStatus.review_done, ContractStatus.approving, ContractStatus.rejected):
        contract.status = ContractStatus.annotating
    db.commit()
    db.refresh(annotation)
    return annotation


def submit_approval(db: Session, contract: Contract, approver: User, decision: ApprovalDecision, comment: str) -> Approval:
    # Simple single-step approval workflow
    approval = Approval(
        contract_id=contract.id,
        approver_id=approver.id,
        step=1,
        decision=decision,
        comment=comment,
    )
    db.add(approval)

    if decision == ApprovalDecision.approved:
        contract.status = ContractStatus.approved
    else:
        contract.status = ContractStatus.rejected

    db.commit()
    db.refresh(approval)
    return approval


def archive_contract(db: Session, contract: Contract) -> Contract:
    if contract.status != ContractStatus.approved:
        raise ValueError("只有已审批通过的合同才能归档")
    contract.status = ContractStatus.archived
    db.commit()
    db.refresh(contract)
    return contract
