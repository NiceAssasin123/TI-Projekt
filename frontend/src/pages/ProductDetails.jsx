import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, ShoppingCart, ImageOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { api } from '../lib/api';
import { useCartStore } from "@/store/useCartStore";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [failedImageUrl, setFailedImageUrl] = useState(null);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        console.error(err);
        setError('Nie udało się pobrać szczegółów produktu.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-zinc-400">
        Ładowanie...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="p-8 text-red-500">
        {error || 'Nie znaleziono produktu'}
      </div>
    );
  }

  const showImage =
    Boolean(product.image_url) && failedImageUrl !== product.image_url;

  const specifications = [
    { label: 'Kategoria', value: product.category },
    { label: 'Kaliber', value: product.caliber },
    {
      label: 'Waga',
      value: product.weight_g != null ? `${product.weight_g} g` : null,
    },
    {
      label: 'Długość lufy',
      value:
        product.barrel_length_mm != null
          ? `${product.barrel_length_mm} mm`
          : null,
    },
    {
      label: 'Pojemność magazynka',
      value:
        product.mag_capacity != null ? `${product.mag_capacity} szt.` : null,
    },
    { label: 'Gwint lufy', value: product.thread },
    { label: 'System szyn', value: product.rail_system },
    {
      label: 'Dostępność',
      value: product.in_stock > 0 ? `${product.in_stock} szt.` : 'Brak w magazynie',
    },
  ].filter((item) => item.value != null && item.value !== '');

const handleAddToCart = () => {
    addItem(product);
  };

  return (
    <div className="mx-auto max-w-5xl p-8">
      <Link
        to="/products"
        className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Wróć do katalogu
      </Link>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="flex aspect-square items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/50 p-8">
          {showImage ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="h-full w-full object-contain"
              onError={() => setFailedImageUrl(product.image_url)}
            />
          ) : (
            <div className="flex flex-col items-center text-zinc-600">
              <ImageOff className="mb-4 h-16 w-16 opacity-50" />
              <span className="text-sm font-medium uppercase tracking-wider">
                Brak zdjęcia
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {product.category && (
              <span className="rounded-md bg-zinc-800 px-2.5 py-1 text-xs font-medium text-zinc-300">
                {product.category}
              </span>
            )}
            {product.requires_permit && (
              <div className="inline-flex items-center gap-2 rounded-md bg-red-500/10 px-3 py-1 text-xs font-medium text-red-500 ring-1 ring-inset ring-red-500/20">
                <ShieldAlert className="h-3.5 w-3.5" /> Wymagane pozwolenie
              </div>
            )}
          </div>

          {product.manufacturer && (
            <h2 className="mb-2 text-sm font-medium text-zinc-400">
              {product.manufacturer}
            </h2>
          )}
          <h1 className="mb-4 text-4xl font-bold text-zinc-100">
            {product.name}
          </h1>

          <div className="mb-6 text-3xl font-bold text-white">
            {product.price.toFixed(2)} zł
          </div>

          {product.description && (
            <p className="mb-6 leading-relaxed text-zinc-300">
              {product.description}
            </p>
          )}

          <div className="mb-8 space-y-2 border-y border-zinc-800 py-6 text-sm text-zinc-300">
            {specifications.map(({ label, value }) => (
              <div key={label} className="flex justify-between gap-4">
                <span className="font-semibold text-zinc-500">{label}:</span>
                <span className="text-right text-zinc-200">{value}</span>
              </div>
            ))}
          </div>

          <Button
            onClick={handleAddToCart}
            size="lg"
            variant="destructive"
            disabled={product.in_stock === 0}
            className="w-full text-base"
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            {product.in_stock > 0 ? 'Dodaj do koszyka' : 'Brak w magazynie'}
          </Button>
        </div>
      </div>
    </div>
  );
}