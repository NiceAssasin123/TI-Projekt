from fastapi.testclient import TestClient
from sqlmodel import Session
from app.models.product import Product
from httpx import Response
from pydantic import TypeAdapter

product_list_adapter: TypeAdapter[list[Product]] = TypeAdapter(list[Product])

def prepare_db(session: Session) -> list[Product]:
    products: list[Product] = [
        Product(
        name="MPS ARMY",
        manufacturer="FB Radom",
        category="Handgun",
        weight_g=780,
        description="Modułowy pistolet samopowtarzalny kalibru 9x19mm Parabellum zaprojektowany przez Fabrykę Broni Łucznik-Radom z polimerowym szkieletem.",
        price=2990.00,
        in_stock=20,
        requires_permit=True,
        caliber="9x19mm Parabellum",
        barrel_length_mm=104,
        mag_capacity="15+1",
        rail_system="Picatinny",
        ),
        Product(
            name="MSBS Grot A3",
            manufacturer="FB Radom",
            category="Assault Rifle",
            weight_g=3650,
            description="Modułowy karabinek systemu MSBS Grot w wersji A3 z ulepszoną ergonomią, obustronnymi manipulatorami oraz regulowaną kolbą.",
            price=8900.00,
            in_stock=15,
            requires_permit=True,
            caliber="5.56x45mm NATO",
            barrel_length_mm=406,
            mag_capacity="30+1",
            thread="1/2x28",
            rail_system="M-LOK",
        ),
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