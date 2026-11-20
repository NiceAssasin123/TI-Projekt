from fastapi.testclient import TestClient
from sqlmodel import Session
from app.models import Product, Category
from httpx import Response
from pydantic import TypeAdapter

product_list_adapter: TypeAdapter[list[Product]] = TypeAdapter(list[Product])

def prepare_db(session: Session) -> list[Product]:
    products: list[Product] = [
        Product(
            name="MPS ARMY",
            manufacturer="FB Radom",
            category=Category.HANDGUN,
            weight_g=780,
            description="Modułowy pistolet samopowtarzalny kalibru 9x19mm Parabellum zaprojektowany przez Fabrykę Broni Łucznik-Radom z polimerowym szkieletem.",
            price=2990.00,
            in_stock=20,
            requires_permit=True,
            caliber="9x19mm",
            barrel_length_mm=104,
            mag_capacity="15+1",
            rail_system="Picatinny",
        ),
        Product(
            name="MSBS Grot A3",
            manufacturer="FB Radom",
            category=Category.RIFLE,
            weight_g=3650,
            description="Modułowy karabinek systemu MSBS Grot w wersji A3 z ulepszoną ergonomią, obustronnymi manipulatorami oraz regulowaną kolbą.",
            price=8900.00,
            in_stock=15,
            requires_permit=True,
            caliber="5.56x45mm",
            barrel_length_mm=406,
            mag_capacity="30+1",
            thread="1/2x28",
            rail_system="M-LOK",
        ),
        Product(
            name="Amunicja 9x19 Parabellum (50 szt.)",
            manufacturer="Sellier & Bellot",
            category=Category.AMMUNITION,
            weight_g=620,
            description="Pełnopłaszczowa amunicja pistoletowa FMJ o masie pocisku 8,0 g (124 gr), przeznaczona do strzelań treningowych i sportowych.",
            price=59.00,
            in_stock=45,
            requires_permit=True,
            caliber="9x19mm",
        ),
        Product(
            name="Strzeleckie ochronniki słuchu Earmor",
            manufacturer="Earmor",
            category=Category.ACCESSORIES,
            weight_g=350,
            description="Aktywne ochronniki słuchu tłumiące impulsy akustyczne powyżej 82 dB przy jednoczesnym wzmacnianiu dźwięków otoczenia.",
            price=185.00,
            in_stock=25,
        ),
    ]
    session.add_all(products)
    session.commit()
    return products

def test_get_all_products(session: Session, client: TestClient) -> None:
    added: list[Product] = prepare_db(session)
    response: Response = client.get("/api/products")
    assert response.status_code == 200
    products: list[Product] = product_list_adapter.validate_json(response.content)
    assert len(products) == len(added)
    assert {p.name for p in products} == {p.name for p in added}

def test_filter_products_by_caliber(session: Session, client: TestClient) -> None:
    added: list[Product] = prepare_db(session)
    response: Response = client.get("/api/products", params={"caliber": "5.56x45mm"})
    assert response.status_code == 200
    products: list[Product] = product_list_adapter.validate_json(response.content)
    expected_names: set[str] = {p.name for p in added if p.caliber == "5.56x45mm"}
    assert len(products) == len(expected_names)
    assert {p.name for p in products} == expected_names

def test_filter_products_by_max_price(session: Session, client: TestClient) -> None:
    added: list[Product] = prepare_db(session)
    response: Response = client.get("/api/products", params={"max_price": 3000.0})
    assert response.status_code == 200
    products: list[Product] = product_list_adapter.validate_json(response.content)
    expected_names: set[str] = {p.name for p in added if p.price <= 3000.0}
    assert len(products) == len(expected_names)
    assert {p.name for p in products} == expected_names

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

def test_search_products(session: Session, client: TestClient) -> None:
    prepare_db(session)

    response_rail: Response = client.get("/api/products", params={"search": "m-lok"})
    assert response_rail.status_code == 200
    products: list[Product] = product_list_adapter.validate_json(response_rail.content)
    assert len(products) == 1
    assert {p.name for p in products} == {"MSBS Grot A3"}

    response_desc: Response = client.get("/api/products", params={"search": "fmj"})
    assert response_desc.status_code == 200
    desc_products: list[Product] = product_list_adapter.validate_json(response_desc.content)
    assert len(desc_products) == 1
    assert {p.name for p in desc_products} == {"Amunicja 9x19 Parabellum (50 szt.)"}

    response_empty: Response = client.get("/api/products", params={"search": "__NIEISTNIEJACY_PRODUKT__"})
    assert response_empty.status_code == 200
    assert response_empty.json() == []

    response_error: Response = client.get("/api/products", params={"search": "a"})
    assert response_error.status_code == 422


def test_filter_products_multi_select(session: Session, client: TestClient) -> None:
    prepare_db(session)

    response_manufacturer: Response = client.get(
        "/api/products",
        params={"manufacturer": ["FB Radom", "Earmor"]},
    )
    assert response_manufacturer.status_code == 200
    manufacturer_products: list[Product] = product_list_adapter.validate_json(response_manufacturer.content)
    assert {p.name for p in manufacturer_products} == {"MPS ARMY", "MSBS Grot A3", "Strzeleckie ochronniki słuchu Earmor"}

    response_category: Response = client.get(
        "/api/products",
        params={"category": ["Broń krótka", "Amunicja"]},
    )
    assert response_category.status_code == 200
    category_products: list[Product] = product_list_adapter.validate_json(response_category.content)
    assert {p.name for p in category_products} == {"MPS ARMY", "Amunicja 9x19 Parabellum (50 szt.)"}

    response: Response = client.get("/api/products", params={"category": "Nieistniejąca"})
    assert response.status_code == 422


def test_filter_products_price_range(session: Session, client: TestClient) -> None:
    prepare_db(session)

    response: Response = client.get(
        "/api/products",
        params={"min_price": 100.0, "max_price": 3000.0},
    )
    assert response.status_code == 200
    products: list[Product] = product_list_adapter.validate_json(response.content)
    assert {p.name for p in products} == {"MPS ARMY", "Strzeleckie ochronniki słuchu Earmor"}


def test_sort_products(session: Session, client: TestClient) -> None:
    prepare_db(session)

    res_price_asc: Response = client.get("/api/products", params={"sort_by": "price_asc"})
    assert res_price_asc.status_code == 200
    prices_asc: list[float] = [
        p.price for p in product_list_adapter.validate_json(res_price_asc.content)
    ]
    assert prices_asc == sorted(prices_asc)

    res_price_desc: Response = client.get("/api/products", params={"sort_by": "price_desc"})
    assert res_price_desc.status_code == 200
    prices_desc: list[float] = [
        p.price for p in product_list_adapter.validate_json(res_price_desc.content)
    ]
    assert prices_desc == sorted(prices_desc, reverse=True)

    res_name_asc: Response = client.get("/api/products", params={"sort_by": "name_asc"})
    assert res_name_asc.status_code == 200
    names_asc: list[str] = [
        p.name for p in product_list_adapter.validate_json(res_name_asc.content)
    ]
    assert names_asc == sorted(names_asc)

    res_name_desc: Response = client.get("/api/products", params={"sort_by": "name_desc"})
    assert res_name_desc.status_code == 200
    names_desc: list[str] = [
        p.name for p in product_list_adapter.validate_json(res_name_desc.content)
    ]
    assert names_desc == sorted(names_desc, reverse=True)

    res_err: Response = client.get("/api/products", params={"sort_by": "category_asc"})
    assert res_err.status_code == 422


def test_combined_filters(session: Session, client: TestClient) -> None:
    prepare_db(session)

    response: Response = client.get(
        "/api/products",
        params={"manufacturer": ["FB Radom"], "caliber": ["9x19mm"], "max_price": 3000.0},
    )
    assert response.status_code == 200
    products: list[Product] = product_list_adapter.validate_json(response.content)
    assert len(products) == 1
    assert {p.name for p in products} == {"MPS ARMY"}