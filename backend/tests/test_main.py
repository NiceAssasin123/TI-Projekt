from httpx import Response
from fastapi.testclient import TestClient
from app.main import app

client: TestClient = TestClient(app)

def test_root() -> None:
    response: Response = client.get("/", headers={"Origin": "http://localhost:5173"})
    assert response.status_code == 200
    assert response.json() == {"message": "Gun Store API is running!"}
    assert response.headers.get("access-control-allow-origin") == "http://localhost:5173"