from pydantic import BaseModel

class Settings(BaseModel):
    PROJECT_NAME: str = "Gun Store API"
    DATABASE_URL: str = "sqlite:///./app.db"
    CORS_ORIGINS: list[str] = [
        "http://localhost:5137",
        "http://127.0.0.1:5137",
    ]

settings = Settings()