from sqlalchemy.engine import Engine
from sqlmodel import create_engine, SQLModel, Session
from sqlmodel.pool import StaticPool
from pytest import fixture
from app.main import app
from app.database import get_session
from fastapi.testclient import TestClient
from collections.abc import Generator

engine: Engine = create_engine(
    "sqlite://",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
)

@fixture(name='session')
def session() -> Generator[Session, None, None]:
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session
    SQLModel.metadata.drop_all(engine)

@fixture(name='client')
def client(session: Session) -> Generator[TestClient, None, None]:
    def get_session_override() -> Session:
        return session
    app.dependency_overrides[get_session] = get_session_override
    client: TestClient = TestClient(app)
    yield client
    app.dependency_overrides.clear()