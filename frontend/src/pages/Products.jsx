import { useState, useEffect } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";
import { ProductFilters } from "@/components/ProductFilters";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Stan przechowujący aktualnie wybrane filtry
  const [filters, setFilters] = useState({
    search: "",
    category: [],
    caliber: []
  });

// Efekt pobierający dane z API za każdym razem, gdy zmienią się filtry
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        // Przygotowujemy czysty obiekt z parametrami
        const activeFilters = {};
        
        // Dodajemy 'search' tylko, jeśli ma jakieś znaki
        if (filters.search && filters.search.trim() !== "") {
          activeFilters.search = filters.search;
        }
        // Dodajemy tablice tylko, jeśli nie są puste
        if (filters.category && filters.category.length > 0) {
          activeFilters.category = filters.category;
        }
        if (filters.caliber && filters.caliber.length > 0) {
          activeFilters.caliber = filters.caliber;
        }

        // Używamy wyczyszczonych filtrów (activeFilters)
        const response = await api.get("/products", { params: activeFilters });
        setProducts(response.data);
      } catch (err) {
        console.error("Błąd pobierania produktów:", err);
        setError("Nie udało się pobrać katalogu produktów. Spróbuj ponownie później.");
      } finally {
        setLoading(false);
      }
    };

    const delayTimer = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(delayTimer);
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleAddToCart = (product) => {
    console.log("Kliknięto Dodaj do koszyka:", product.name);
    // Tutaj w przyszłości podłączysz logikę koszyka
  };

  return (
    <div className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8">
      <div className="flex flex-col gap-8 md:flex-row">
        
        {/* Lewa kolumna: Pasek filtrów */}
        <aside className="w-full shrink-0 md:w-64 lg:w-72">
          {/* Klasa sticky sprawia, że filtry zostają na ekranie podczas przewijania w dół */}
          <div className="sticky top-24">
            <ProductFilters filters={filters} onFilterChange={handleFilterChange} />
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
                onClick={() => setFilters({ search: "", category: [], caliber: [] })}
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