import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Loader2, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";
import { ProductFilters } from "@/components/ProductFilters";

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Kategorie i kalibry w stanie lokalnym, a search zsynchronizowany z adresem URL
  const [selectedFilters, setSelectedFilters] = useState({
    category: [],
    caliber: [],
  });

  const searchQuery = searchParams.get("search") || "";
  const trimmedSearch = searchQuery.trim();
  const effectiveSearch =
    trimmedSearch.length >= 2 ? trimmedSearch.slice(0, 50) : "";

  const filters = {
    search: searchQuery,
    category: selectedFilters.category,
    caliber: selectedFilters.caliber,
  };

  // Efekt pobierający dane z API przy zmianie efektywnych filtrów
  useEffect(() => {
    let isCancelled = false;

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const activeFilters = {};

        if (effectiveSearch) {
          activeFilters.search = effectiveSearch;
        }
        if (selectedFilters.category.length > 0) {
          activeFilters.category = selectedFilters.category;
        }
        if (selectedFilters.caliber.length > 0) {
          activeFilters.caliber = selectedFilters.caliber;
        }

        const response = await api.get("/products", { params: activeFilters });
        if (!isCancelled) {
          setProducts(response.data);
        }
      } catch (err) {
        console.error("Błąd pobierania produktów:", err);
        if (!isCancelled) {
          setError(
            "Nie udało się pobrać katalogu produktów. Spróbuj ponownie później."
          );
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    const delayTimer = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => {
      isCancelled = true;
      clearTimeout(delayTimer);
    };
  }, [effectiveSearch, selectedFilters.category, selectedFilters.caliber]);

  const handleFilterChange = (key, value) => {
    if (key === "search") {
      const nextParams = new URLSearchParams(searchParams);
      if (value) {
        nextParams.set("search", value);
      } else {
        nextParams.delete("search");
      }
      setSearchParams(nextParams, { replace: true });
      return;
    }

    setSelectedFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setSelectedFilters({ category: [], caliber: [] });
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("search");
    setSearchParams(nextParams, { replace: true });
  };

  const handleAddToCart = (product) => {
    console.log("Kliknięto Dodaj do koszyka:", product.name);
    // Tutaj w podłączę logikę koszyka
  };

  return (
    <div className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8">
      <div className="flex flex-col gap-8 md:flex-row">
        {/* Lewa kolumna: Pasek filtrów */}
        <aside className="w-full shrink-0 md:w-64 lg:w-72">
          <div className="sticky top-24">
            <ProductFilters
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </div>
        </aside>

        {/* Prawa kolumna: Wyniki i siatka */}
        <main className="flex-1">
          {error && (
            <div className="mb-6 flex items-center gap-2 rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-red-500">
              <AlertCircle className="h-5 w-5" />
              <p>{error}</p>
            </div>
          )}

          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
            </div>
          ) : products.length === 0 && !error ? (
            <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-zinc-700 bg-zinc-900/30 text-zinc-400">
              <p>Nie znaleziono produktów dla podanych kryteriów.</p>
              <button
                onClick={handleClearFilters}
                className="mt-4 text-red-500 transition-colors hover:text-red-400"
              >
                Wyczyść filtry
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}