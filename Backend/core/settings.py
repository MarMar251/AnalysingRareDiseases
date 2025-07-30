# core/settings.py
from datetime import timedelta
from pydantic_settings import BaseSettings, SettingsConfigDict
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent.parent

class Settings(BaseSettings):
    # ── Environment ────────────────────────────────────────────
    env: str = "dev"  # dev | prod | test

    # ── Database ───────────────────────────────────────────────
    database_url: str = "postgresql://postgres:24.25@localhost/clinical_db"

    # ── Security / JWT ─────────────────────────────────────────
    secret_key: str = "dev-secret-key"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24  # 24 h

    @property
    def access_token_expire(self) -> timedelta:
        return timedelta(minutes=self.access_token_expire_minutes)

    # ── ML device preference ──────────────────────────────────
    device_str: str = "auto"  # auto | cpu | cuda

    # ── MedCLIP model path ─────────────────────────────────────
    @property
    def medclip_model_path(self) -> Path:
        return BASE_DIR / "infrastructure" / "ai" / "weights" / "best_model.pth"

    # ── pydantic-settings config ──────────────────────────────
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )



settings = Settings()
