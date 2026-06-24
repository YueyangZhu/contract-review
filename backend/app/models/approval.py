import uuid
from datetime import datetime, timezone
from sqlalchemy import String, Text, ForeignKey, Enum, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base
import enum


class ApprovalDecision(str, enum.Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"


class Approval(Base):
    __tablename__ = "approvals"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    contract_id: Mapped[str] = mapped_column(String(36), ForeignKey("contracts.id"))
    approver_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"))
    step: Mapped[int] = mapped_column(Integer, default=1)
    decision: Mapped[ApprovalDecision] = mapped_column(Enum(ApprovalDecision), default=ApprovalDecision.pending)
    comment: Mapped[str] = mapped_column(Text, default="")
    created_at: Mapped[datetime] = mapped_column(default=lambda: datetime.now(timezone.utc))

    contract: Mapped["Contract"] = relationship("Contract", back_populates="approvals")
    approver: Mapped["User"] = relationship("User", back_populates="approvals")
