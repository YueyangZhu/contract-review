import uuid
from datetime import datetime, timezone
from sqlalchemy import String, Text, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class Annotation(Base):
    __tablename__ = "annotations"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    contract_id: Mapped[str] = mapped_column(String(36), ForeignKey("contracts.id"))
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"))
    quote: Mapped[str] = mapped_column(Text, default="")
    content: Mapped[str] = mapped_column(Text, default="")
    start_index: Mapped[int] = mapped_column(Integer, default=0)
    end_index: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(default=lambda: datetime.now(timezone.utc))

    contract: Mapped["Contract"] = relationship("Contract", back_populates="annotations")
    user: Mapped["User"] = relationship("User", back_populates="annotations")
