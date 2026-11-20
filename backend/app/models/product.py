from typing import Optional
from sqlmodel import SQLModel, Field
from enum import StrEnum

class Category(StrEnum):
    HANDGUN = "Broń krótka"
    RIFLE = "Karabinki"
    SHOTGUN = "Strzelby"
    AMMUNITION = "Amunicja"
    ACCESSORIES = "Akcesoria"
    MODIFICATIONS = "Modyfikacje"

class Product(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    manufacturer: str
    category: Category
    weight_g: int = Field(gt=0)
    description: str = Field(min_length=3, max_length=500)
    price: float = Field(gt=0)
    in_stock: int = Field(default=0, ge=0)
    requires_permit: bool = False
    caliber: Optional[str] = None
    barrel_length_mm: Optional[int] = None
    mag_capacity: Optional[str] = None
    thread: Optional[str] = None
    rail_system: Optional[str] = None
    image_url: Optional[str] = None

class CatalogFiltersResponse(SQLModel):
    categories: list[str]
    calibers: list[str]