from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.deps import get_current_user
from app.models import Review, User
from app.schemas.review import ReviewOut

router = APIRouter(prefix="/reviews", tags=["审核报告"])


@router.get("/{review_id}", response_model=ReviewOut)
def get_review(review_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="报告不存在")
    return review
