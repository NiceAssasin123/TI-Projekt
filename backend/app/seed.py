from app.models import Product, Category
from app.database import init_db, engine
from sqlmodel import Session, select

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
        image_url="/images/mps_army.png",
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
        image_url="/images/grot_a3.jpg",
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
        image_url="/images/9_19_parabellum.jpg",
    ),
    Product(
        name="Strzeleckie ochronniki słuchu Earmor",
        manufacturer="Earmor",
        category=Category.ACCESSORIES,
        weight_g=350,
        description="Aktywne ochronniki słuchu tłumiące impulsy akustyczne powyżej 82 dB przy jednoczesnym wzmacnianiu dźwięków otoczenia.",
        price=185.00,
        in_stock=25,
        image_url="/images/earmor.jpg",
    ),
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


if __name__ == "__main__": # python -m app.seed
    seed_products()