import uuid
from datetime import datetime, timezone
from sqlalchemy import String, Text, ForeignKey, Enum, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base
import enum


class ContractStatus(str, enum.Enum):
    uploaded = "uploaded"
    parsing = "parsing"
    reviewing = "reviewing"
    review_done = "review_done"
    annotating = "annotating"
    approving = "approving"
    approved = "approved"
    rejected = "rejected"
    archived = "archived"


class Contract(Base):
    __tablename__ = "contracts"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title: Mapped[str] = mapped_column(String(255))
    file_name: Mapped[str] = mapped_column(String(255))
    file_path: Mapped[str] = mapped_column(String(500))
    file_type: Mapped[str] = mapped_column(String(50))
    file_size: Mapped[int] = mapped_column(Integer)
    content: Mapped[str] = mapped_column(Text, default="")
    status: Mapped[ContractStatus] = mapped_column(Enum(ContractStatus), default=ContractStatus.uploaded)
    uploader_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"))
    created_at: Mapped[datetime] = mapped_column(default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    uploader: Mapped["User"] = relationship("User", back_populates="contracts")
    review: Mapped["Review"] = relationship("Review", back_populates="contract", uselist=False)
    annotations: Mapped[list["Annotation"]] = relationship("Annotation", back_populates="contract")
    approvals: Mapped[list["Approval"]] = relationship("Approval", back_populates="contract")
