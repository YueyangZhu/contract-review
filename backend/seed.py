"""初始化默认用户账号，仅用于开发测试。"""
from sqlalchemy.orm import Session
from app.db.base import Base
from app.db.session import SessionLocal, engine
from app.models import User, UserRole
from app.core.security import get_password_hash

Base.metadata.create_all(bind=engine)

DEFAULT_USERS = [
    {"username": "admin", "email": "admin@example.com", "password": "admin123", "role": UserRole.admin},
    {"username": "legal", "email": "legal@example.com", "password": "legal123", "role": UserRole.legal},
    {"username": "business", "email": "business@example.com", "password": "business123", "role": UserRole.business},
    {"username": "approver", "email": "approver@example.com", "password": "approver123", "role": UserRole.approver},
]


def seed():
    db: Session = SessionLocal()
    try:
        for u in DEFAULT_USERS:
            exists = db.query(User).filter(User.username == u["username"]).first()
            if exists:
                print(f"用户 {u['username']} 已存在，跳过")
                continue
            user = User(
                username=u["username"],
                email=u["email"],
                hashed_password=get_password_hash(u["password"]),
                role=u["role"],
            )
            db.add(user)
            print(f"已创建用户 {u['username']} / {u['password']}")
        db.commit()
    finally:
        db.close()


if __name__ == "__main__":
    seed()
