import { Button } from "@/components/ui/button";

export function ProductCard({ product, onAddToCart }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 hover:border-zinc-600 transition-colors flex flex-col">
      <div className="h-48 bg-zinc-950 rounded-md mb-4 flex items-center justify-center text-zinc-600 border border-zinc-800">
        [Zdjęcie: {product.name}]
      </div>
      <div className="text-sm text-zinc-400 font-semibold mb-1">
        {product.category}
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