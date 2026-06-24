from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    database_url: str = "sqlite:///./contract_review.db"
    llm_provider: str = "mock"  # mock / deepseek / openai
    deepseek_api_key: str = ""
    deepseek_base_url: str = "https://api.deepseek.com"
    openai_api_key: str = ""
    openai_base_url: str = "https://api.openai.com/v1"
    secret_key: str = ""
    access_token_expire_minutes: int = 60
    frontend_url: str = "http://localhost:5174,http://localhost:5175,http://127.0.0.1:5174,http://127.0.0.1:5175"
    upload_dir: str = "uploads"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache
def get_settings() -> Settings:
    settings = Settings()
    if not settings.secret_key:
        raise ValueError("SECRET_KEY environment variable is required")
    return settings
