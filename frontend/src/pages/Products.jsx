import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Loader2, AlertCircle, ArrowUpDown } from "lucide-react";
import { api } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";
import { ProductFilters } from "@/components/ProductFilters";

const SORT_OPTIONS = [
  { value: "", label: "Domyślne" },
  { value: "price_asc", label: "Cena: od najniższej" },
  { value: "price_desc", label: "Cena: od najwyższej" },
  { value: "name_asc", label: "Nazwa: A–Z" },
  { value: "name_desc", label: "Nazwa: Z–A" },
];

const INITIAL_FILTERS = {
  category: [],
  caliber: [],
  manufacturer: [],
  min_price: "",
  max_price: "",
  sort_by: "",
};

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState(INITIAL_FILTERS);

  const searchQuery = searchParams.get("search") || "";
  const trimmedSearch = searchQuery.trim();
  const effectiveSearch =
    trimmedSearch.length >= 2 ? trimmedSearch.slice(0, 50) : "";

  const filters = {
    search: searchQuery,
    ...selectedFilters,
  };

  const hasActiveFilters = Boolean(
    searchQuery.trim() ||
      selectedFilters.category.length > 0 ||
      selectedFilters.caliber.length > 0 ||
      selectedFilters.manufacturer.length > 0 ||
      selectedFilters.min_price !== "" ||
      selectedFilters.max_price !== "" ||
      selectedFilters.sort_by !== ""
  );

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
        if (selectedFilters.manufacturer.length > 0) {
          activeFilters.manufacturer = selectedFilters.manufacturer;
        }

        if (selectedFilters.min_price !== "") {
          const parsedMin = Number(selectedFilters.min_price);
          if (!Number.isNaN(parsedMin) && parsedMin >= 0) {
            activeFilters.min_price = parsedMin;
          }
        }
        if (selectedFilters.max_price !== "") {
          const parsedMax = Number(selectedFilters.max_price);
          if (!Number.isNaN(parsedMax) && parsedMax >= 0) {
            activeFilters.max_price = parsedMax;
          }
        }
        if (selectedFilters.sort_by) {
          activeFilters.sort_by = selectedFilters.sort_by;
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
  }, [
    effectiveSearch,
    selectedFilters.category,
    selectedFilters.caliber,
    selectedFilters.manufacturer,
    selectedFilters.min_price,
    selectedFilters.max_price,
    selectedFilters.sort_by,
  ]);

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
    setSelectedFilters(INITIAL_FILTERS);
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("search");
    setSearchParams(nextParams, { replace: true });
  };

  const handleAddToCart = (product) => {
    console.log("Kliknięto Dodaj do koszyka:", product.name);
    // Logika koszyka w Issue #6
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
              onClearFilters={handleClearFilters}
              hasActiveFilters={hasActiveFilters}
            />
          </div>
        </aside>

        {/* Prawa kolumna: Pasek sortowania i siatka wyników */}
        <main className="flex-1">
          <div className="mb-6 flex flex-col gap-3 rounded-xl border border-zinc-800 bg-zinc-900/30 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-zinc-400">
              {loading
                ? "Wyszukiwanie produktów..."
                : `Znaleziono produktów: ${products.length}`}
            </p>

            <label className="flex items-center gap-2 text-sm text-zinc-300">
              <ArrowUpDown className="h-4 w-4 text-zinc-500" />
              <span className="shrink-0 text-zinc-400">Sortuj:</span>
              <select
                value={selectedFilters.sort_by}
                onChange={(e) => handleFilterChange("sort_by", e.target.value)}
                aria-label="Sortowanie produktów"
                className="cursor-pointer rounded-md border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-sm text-zinc-100 outline-none transition-colors hover:border-zinc-600 focus:border-red-500"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

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
                type="button"
                onClick={handleClearFilters}
                className="mt-4 cursor-pointer text-red-500 transition-colors hover:text-red-400"
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