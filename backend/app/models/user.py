import uuid
from datetime import datetime, timezone
from sqlalchemy import String, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base
import enum


class UserRole(str, enum.Enum):
    admin = "admin"
    legal = "legal"
    business = "business"
    approver = "approver"


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    username: Mapped[str] = mapped_column(String(100), unique=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255))
    role: Mapped[UserRole] = mapped_column(Enum(UserRole), default=UserRole.business)
    is_active: Mapped[bool] = mapped_column(default=True)
    created_at: Mapped[datetime] = mapped_column(default=lambda: datetime.now(timezone.utc))

    contracts: Mapped[list["Contract"]] = relationship("Contract", back_populates="uploader")
    annotations: Mapped[list["Annotation"]] = relationship("Annotation", back_populates="user")
    approvals: Mapped[list["Approval"]] = relationship("Approval", back_populates="approver")
