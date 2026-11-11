import { useState } from "react";
import { Crosshair, Package, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

function renderCategoryIcon(category = "") {
  const cat = category.toLowerCase();
  if (
    cat.includes("handgun") ||
    cat.includes("rifle") ||
    cat.includes("pistolet") ||
    cat.includes("broń") ||
    cat.includes("strzelba")
  ) {
    return <Crosshair className="w-12 h-12 stroke-[1.5] text-zinc-600" />;
  }
  if (cat.includes("ammo") || cat.includes("amunicja")) {
    return <Package className="w-12 h-12 stroke-[1.5] text-zinc-600" />;
  }
  if (
    cat.includes("head") ||
    cat.includes("accessory") ||
    cat.includes("akcesoria") ||
    cat.includes("ochron")
  ) {
    return <Shield className="w-12 h-12 stroke-[1.5] text-zinc-600" />;
  }
  return <Crosshair className="w-12 h-12 stroke-[1.5] text-zinc-600" />;
}

export function ProductCard({ product, onAddToCart }) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 hover:border-zinc-600 transition-colors flex flex-col">
      <div className="h-48 bg-zinc-950 rounded-md mb-4 flex items-center justify-center text-zinc-600 border border-zinc-800 overflow-hidden">
        {product.image_url && !imageError ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-contain p-2"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-zinc-600 gap-2 select-none">
            {renderCategoryIcon(product.category)}
            <span className="text-xs uppercase tracking-wider text-zinc-500 font-medium">
              Brak zdjęcia
            </span>
          </div>
        )}
      </div>
      <div className="text-sm text-zinc-400 font-semibold mb-1 flex items-center justify-between gap-2">
        <span>{product.category}</span>
        {product.caliber && (
          <span className="text-xs text-zinc-500 font-normal">
            {product.caliber}
          </span>
        )}
      </div>
      <h3 className="text-lg font-bold mb-4 flex-grow">{product.name}</h3>
      <div className="flex justify-between items-center mt-auto pt-4 border-t border-zinc-800">
        <span className="text-xl font-bold">{product.price} PLN</span>
        <Button 
          className="bg-zinc-100 text-zinc-950 hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
          onClick={onAddToCart}
        >
          Do koszyka
        </Button>
      </div>
    </div>
  );
}