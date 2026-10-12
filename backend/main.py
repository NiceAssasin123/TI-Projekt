from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Product(BaseModel):
    name: str
    caliber: str
    price: float

# Baza danych w pamięci RAM na potrzeby testu:
products_db = []

@app.get("/")
def read_root():
    return {"status": "API dziala poprawnie"}

@app.get("/api/products")
def get_products():
    return products_db

@app.post("/api/products", status_code=201)
def add_product(product: Product):
    products_db.append(product)
    return {"message": "Produkt dodany pomyslnie", "product": product}