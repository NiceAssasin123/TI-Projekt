from typing import List, Optional, Literal
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlmodel import Session, select, or_, col
from app.database import get_session
from app.models import Product, Category, CatalogFiltersResponse
from collections.abc import Sequence

router = APIRouter(prefix="/api/products", tags=["products"])

@router.get("", response_model=List[Product])
def get_products(
    search: Optional[str] = Query(default=None, min_length=2, max_length=50),
    manufacturer: Optional[list[str]] = Query(default=None),
    category: Optional[list[Category]] = Query(default=None),
    caliber: Optional[list[str]] = Query(default=None),
    min_price: Optional[float] = Query(default=None, ge=0),
    max_price: Optional[float] = Query(default=None, ge=0),
    sort_by: Optional[Literal["price_asc", "price_desc", "name_asc", "name_desc"]] = None,
    session: Session = Depends(get_session)
) -> Sequence[Product]:
    query = select(Product)

    if search:
        pattern: str = f"%{search}%"
        query = query.where(
            or_(
                col(Product.name).ilike(pattern),
                col(Product.description).ilike(pattern),
                col(Product.caliber).ilike(pattern),
                col(Product.category).ilike(pattern),
                col(Product.manufacturer).ilike(pattern),
                col(Product.thread).ilike(pattern),
                col(Product.rail_system).ilike(pattern),
            )
        )
    if manufacturer:
        query = query.where(col(Product.manufacturer).in_(manufacturer))
    if category:
        query = query.where(col(Product.category).in_(category))
    if caliber:
        query = query.where(col(Product.caliber).in_(caliber))
    if min_price is not None:
        query = query.where(Product.price >= min_price)
    if max_price is not None:
        query = query.where(Product.price <= max_price)

    match sort_by:
        case "price_asc":
            query = query.order_by(col(Product.price).asc())
        case "price_desc":
            query = query.order_by(col(Product.price).desc())
        case "name_asc":
            query = query.order_by(col(Product.name).asc())
        case "name_desc":
            query = query.order_by(col(Product.name).desc())
        case None:
            pass

    return session.exec(query).all()

@router.get("/filters", response_model=CatalogFiltersResponse)
def get_filters(session: Session = Depends(get_session)) -> CatalogFiltersResponse:
    categories: list[str] = [c.value for c in Category]
    caliber_query = select(Product.caliber)
    caliber_query = caliber_query.where(col(Product.caliber).is_not(None))
    caliber_query = caliber_query.distinct()
    caliber_query = caliber_query.order_by(col(Product.caliber))
    raw_calibers: Sequence[Optional[str]] = session.exec(caliber_query).all()
    calibers: list[str] = [c for c in raw_calibers if c is not None]
    return CatalogFiltersResponse(categories=categories, calibers=calibers)

@router.get("/{product_id}", response_model=Product)
def get_product(
    product_id: int,
    session: Session = Depends(get_session)
) -> Product:
    product = session.get(Product, product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with id {product_id} not found"
        )
    return product