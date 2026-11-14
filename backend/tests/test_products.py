from fastapi.testclient import TestClient
from sqlmodel import Session
from app.models.product import Product
from httpx import Response
from pydantic import TypeAdapter

product_list_adapter: TypeAdapter[list[Product]] = TypeAdapter(list[Product])

def prepare_db(session: Session) -> list[Product]:
    products: list[Product] = [
        Product(name="MPS ARMY", category="Handgun", caliber="9x19mm Parabellum", price=2990.00, in_stock=20, requires_permit=True),
        Product(name="MSBS Grot A3", category="Assault Rifle", caliber="5.56x45mm NATO", price=8900.00, in_stock=15, requires_permit=True),
    ]
    session.add_all(products)
    session.commit()
    return products

def test_get_all_products(session: Session, client: TestClient) -> None:
    prepare_db(session)
    response: Response = client.get("/api/products")
    assert response.status_code == 200
    products: list[Product] = product_list_adapter.validate_json(response.content)
    assert len(products) == 2
    assert {p.name for p in products} == {"MPS ARMY", "MSBS Grot A3"}

def test_filter_products_by_caliber(session: Session, client: TestClient) -> None:
    prepare_db(session)
    response: Response = client.get("/api/products", params={"caliber": "5.56x45mm NATO"})
    assert response.status_code == 200
    products: list[Product] = product_list_adapter.validate_json(response.content)
    assert len(products) == 1
    assert products[0].name == "MSBS Grot A3"

def test_filter_products_by_max_price(session: Session, client: TestClient) -> None:
    prepare_db(session)
    response: Response = client.get("/api/products", params={"max_price": 3000.0})
    assert response.status_code == 200
    products: list[Product] = product_list_adapter.validate_json(response.content)
    assert len(products) == 1
    assert products[0].name == "MPS ARMY"

def test_get_product_by_id(session: Session, client: TestClient) -> None:
    added: list[Product] = prepare_db(session)
    response: Response = client.get(f"/api/products/{added[0].id}")
    assert response.status_code == 200
    product: Product = Product.model_validate_json(response.content)
    assert product.id == added[0].id
    assert product.name == added[0].name

def test_get_nonexistent_product_returns_404(client: TestClient) -> None:
    response: Response = client.get("/api/products/999")
    assert response.status_code == 404