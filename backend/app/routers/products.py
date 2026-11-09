from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from app.database import get_session
from app.models import Product
from collections.abc import Sequence

router = APIRouter(prefix="/api/products", tags=["products"])

@router.get("", response_model=List[Product])
def get_products(
    category: Optional[str] = None,
    caliber: Optional[str] = None,
    max_price: Optional[float] = None,
    session: Session = Depends(get_session)
) -> Sequence[Product]:
    query = select(Product)

    if category:
        query = query.where(Product.category == category)
    if caliber:
        query = query.where(Product.caliber == caliber)
    if max_price is not None:
        query = query.where(Product.price <= max_price)

    return session.exec(query).all()

@router.get("/{product_id}", response_model=Product)
def get_product(
    product_id: int,
    session: Session = Depends(get_session)
) -> Product | HTTPException:
    product = session.get(Product, product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with id {product_id} not found"
        )
    return product