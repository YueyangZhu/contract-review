import uuid
from datetime import datetime, timezone
from sqlalchemy import String, Text, ForeignKey, Integer, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class Review(Base):
    __tablename__ = "reviews"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    contract_id: Mapped[str] = mapped_column(String(36), ForeignKey("contracts.id"))
    score: Mapped[float] = mapped_column(Float, default=100)
    summary: Mapped[str] = mapped_column(Text, default="")
    status: Mapped[str] = mapped_column(String(20), default="completed")
    created_at: Mapped[datetime] = mapped_column(default=lambda: datetime.now(timezone.utc))

    contract: Mapped["Contract"] = relationship("Contract", back_populates="review")
    risks: Mapped[list["Risk"]] = relationship("Risk", back_populates="review", cascade="all, delete-orphan")
