from typing import Generator
from sqlmodel import SQLModel, create_engine, Session
from sqlalchemy.engine import Engine
from app.core.config import settings

engine: Engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False}
)

def init_db() -> None:
    SQLModel.metadata.create_all(engine)

def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session