import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, ShoppingCart, ImageOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { api } from '../lib/api';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        console.error(err)
        setError("Nie udało się pobrać szczegółów produktu.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="flex h-64 items-center justify-center text-zinc-400">Ładowanie...</div>;
  if (error || !product) return <div className="p-8 text-red-500">{error || "Nie znaleziono produktu"}</div>;

  return (
    <div className="mx-auto max-w-5xl p-8">
      <Link to="/products" className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Wróć do katalogu
      </Link>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Lewa kolumna: Zdjęcie */}
        <div className="flex aspect-square items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/50 p-8">
          {product.image_url ? (
            <img 
              src={product.image_url} 
              alt={product.name} 
              className="h-full w-full object-contain"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          ) : (
            <div className="flex flex-col items-center text-zinc-600">
              <ImageOff className="mb-4 h-16 w-16 opacity-50" />
              <span className="text-sm font-medium uppercase tracking-wider">Brak zdjęcia</span>
            </div>
          )}
        </div>

        {/* Prawa kolumna: Szczegóły */}
        <div className="flex flex-col justify-center">
          {product.requires_permit && (
            <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-md bg-red-500/10 px-3 py-1.5 text-sm font-medium text-red-500 ring-1 ring-inset ring-red-500/20">
              <ShieldAlert className="h-4 w-4" /> Wymagane pozwolenie
            </div>
          )}
          
          <h2 className="mb-2 text-sm font-medium text-zinc-400">{product.manufacturer}</h2>
          <h1 className="mb-6 text-4xl font-bold text-zinc-100">{product.name}</h1>
          
          <div className="mb-8 text-3xl font-bold text-white">
            {product.price.toFixed(2)} zł
          </div>

          <div className="mb-8 space-y-2 border-y border-zinc-800 py-6 text-sm text-zinc-300">
            <p><span className="font-semibold text-zinc-500">Kaliber:</span> {product.caliber || "Brak danych"}</p>
            <p><span className="font-semibold text-zinc-500">Dostępność:</span> {product.in_stock > 0 ? `${product.in_stock} szt.` : "Brak w magazynie"}</p>
          </div>

          <Button
            onClick={() => alert(`Dodano do koszyka: ${product.name}`)}
            size="lg"
            variant={product.requires_permit ? "destructive" : "default"}
            disabled={product.in_stock === 0}
            className="w-full text-base"
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            {product.in_stock > 0 ? "Dodaj do koszyka" : "Brak w magazynie"}
          </Button>
        </div>
      </div>
    </div>
  );
}