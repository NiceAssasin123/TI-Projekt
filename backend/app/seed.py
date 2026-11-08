from app.models import Product
from app.database import init_db, engine
from sqlmodel import Session, select

products: list[Product] = [
    Product(name="MPS ARMY", category="Handgun", caliber="9x19mm Parabellum", price=2990.00, in_stock=20, requires_permit=True),
    Product(name="MSBS Grot A3", category="Assault Rifle", caliber="5.56x45mm NATO", price=8900.00, in_stock=15, requires_permit=True),
    Product(name="Amunicja 9x19 Parabellum (50 szt.)", category="Ammunition", caliber="9x19mm Parabellum", price=59.00, in_stock=45, requires_permit=True),
    Product(name="Strzeleckie ochronniki słuchu Earmor", category="Head Accessory", price=185.00, in_stock=25),
]

def seed_products() -> None:
    init_db()
    with Session(engine) as session:
        existing_product: Product | None = session.exec(select(Product)).first()
        if existing_product:
            print("The database already contains some data")
            return
        
        session.add_all(products)
        session.commit()
        print("Successfully commited the changes")


if __name__ == "__main__":
    seed_products()