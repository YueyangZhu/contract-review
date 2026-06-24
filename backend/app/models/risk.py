import uuid
from sqlalchemy import String, Text, ForeignKey, Integer, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base
import enum


class RiskLevel(str, enum.Enum):
    high = "high"
    medium = "medium"
    low = "low"


class Risk(Base):
    __tablename__ = "risks"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    review_id: Mapped[str] = mapped_column(String(36), ForeignKey("reviews.id"))
    clause: Mapped[str] = mapped_column(Text)
    start_index: Mapped[int] = mapped_column(Integer)
    end_index: Mapped[int] = mapped_column(Integer)
    level: Mapped[RiskLevel] = mapped_column(Enum(RiskLevel))
    category: Mapped[str] = mapped_column(String(100))
    description: Mapped[str] = mapped_column(Text)
    suggestion: Mapped[str] = mapped_column(Text)

    review: Mapped["Review"] = relationship("Review", back_populates="risks")
