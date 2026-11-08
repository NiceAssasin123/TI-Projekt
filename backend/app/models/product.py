from typing import Optional
from sqlmodel import SQLModel, Field

class Product(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    category: str
    caliber: Optional[str] = None
    price: float
    in_stock: int = Field(default=0)
    requires_permit: bool = False
    image_url: Optional[str] = None