import { useState } from "react";
import { ShieldAlert, ShoppingCart, ImageOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function ProductCard({ product, onAddToCart }) {
  const {
    id,
    name,
    manufacturer,
    price,
    image_url,
    caliber,
    requires_permit,
    in_stock,
  } = product;

  const [failedImageUrl, setFailedImageUrl] = useState(null);
  const showImage = Boolean(image_url) && failedImageUrl !== image_url;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 transition-colors hover:border-zinc-700">
      <Link to={`/products/${id}`} className="relative block">
        {requires_permit && (
          <div className="absolute right-2 top-2 z-10 flex items-center gap-1 rounded-md bg-red-500/10 px-2 py-1 text-xs font-medium text-red-500 ring-1 ring-inset ring-red-500/20 backdrop-blur-sm">
            <ShieldAlert className="h-3 w-3" />
            Wymagane pozwolenie
          </div>
        )}

        <div className="flex aspect-square items-center justify-center bg-zinc-800/30 p-4 transition-transform hover:scale-105">
          {showImage ? (
            <img
              src={image_url}
              alt={name}
              className="h-full w-full object-contain"
              onError={() => setFailedImageUrl(image_url)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-zinc-600">
              <ImageOff className="mb-2 h-10 w-10 opacity-50" />
              <span className="text-xs font-medium uppercase tracking-wider">
                Brak zdjęcia
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <Link to={`/products/${id}`} className="group-hover:text-zinc-300">
            {manufacturer && (
              <p className="text-xs text-zinc-400">{manufacturer}</p>
            )}
            <h3 className="line-clamp-2 font-medium text-zinc-100 transition-colors group-hover:text-red-500">
              {name}
            </h3>
          </Link>

          <p className="shrink-0 font-semibold text-zinc-100">
            {price.toFixed(2)} zł
          </p>
        </div>

        {caliber && (
          <div className="mt-2 text-sm text-zinc-400">
            Kaliber: <span className="text-zinc-300">{caliber}</span>
          </div>
        )}

        <div className="mt-auto pt-4">
          <Button
            onClick={() => onAddToCart?.(product)}
            className="w-full"
            variant={requires_permit ? "destructive" : "default"}
            disabled={in_stock === 0}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {in_stock > 0 ? "Do koszyka" : "Brak w magazynie"}
          </Button>
        </div>
      </div>
    </div>
  );
}