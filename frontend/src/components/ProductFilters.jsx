import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { api } from "../lib/api";

export function ProductFilters({ filters, onFilterChange }) {
  const [categories, setCategories] = useState([]);
  const [calibers, setCalibers] = useState([]);
  const [loadingFilters, setLoadingFilters] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchFilterOptions = async () => {
      try {
        const response = await api.get("/products/filters");
        if (isMounted) {
          setCategories(response.data.categories || []);
          setCalibers(response.data.calibers || []);
        }
      } catch (err) {
        console.error("Nie udało się pobrać opcji filtrów:", err);
      } finally {
        if (isMounted) {
          setLoadingFilters(false);
        }
      }
    };

    fetchFilterOptions();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleArrayFilter = (key, value, isChecked) => {
    const currentList = filters[key] || [];
    const newList = isChecked
      ? [...currentList, value]
      : currentList.filter((item) => item !== value);
    onFilterChange(key, newList);
  };

  const trimmedSearchLength = (filters.search || "").trim().length;

  return (
    <div className="flex flex-col gap-6 rounded-xl border border-zinc-800 bg-zinc-900/30 p-5">
      {/* Sekcja Wyszukiwania */}
      <div>
        <h3 className="mb-3 text-sm font-medium text-zinc-200">Wyszukaj</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <Input
            placeholder="Szukaj produktu..."
            className="pl-9"
            maxLength={50}
            value={filters.search || ""}
            onChange={(e) => onFilterChange("search", e.target.value)}
          />
        </div>
        {trimmedSearchLength === 1 && (
          <p className="mt-1.5 text-xs text-zinc-500">
            Wpisz co najmniej 2 znaki, aby wyszukać.
          </p>
        )}
      </div>

      {/* Sekcja Kategorii */}
      <div>
        <h3 className="mb-3 text-sm font-medium text-zinc-200">Kategorie</h3>
        <div className="flex flex-col gap-2">
          {loadingFilters ? (
            <p className="text-xs text-zinc-500">Ładowanie kategorii...</p>
          ) : categories.length === 0 ? (
            <p className="text-xs text-zinc-500">Brak dostępnych kategorii</p>
          ) : (
            categories.map((cat) => (
              <label
                key={cat}
                className="flex cursor-pointer items-center gap-3 text-sm text-zinc-400 hover:text-zinc-200"
              >
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-red-500 focus:ring-red-500/20"
                  checked={(filters.category || []).includes(cat)}
                  onChange={(e) =>
                    handleArrayFilter("category", cat, e.target.checked)
                  }
                />
                {cat}
              </label>
            ))
          )}
        </div>
      </div>

      {/* Sekcja Kalibrów */}
      <div>
        <h3 className="mb-3 text-sm font-medium text-zinc-200">Kaliber</h3>
        <div className="flex flex-col gap-2">
          {loadingFilters ? (
            <p className="text-xs text-zinc-500">Ładowanie kalibrów...</p>
          ) : calibers.length === 0 ? (
            <p className="text-xs text-zinc-500">Brak dostępnych kalibrów</p>
          ) : (
            calibers.map((cal) => (
              <label
                key={cal}
                className="flex cursor-pointer items-center gap-3 text-sm text-zinc-400 hover:text-zinc-200"
              >
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-red-500 focus:ring-red-500/20"
                  checked={(filters.caliber || []).includes(cal)}
                  onChange={(e) =>
                    handleArrayFilter("caliber", cal, e.target.checked)
                  }
                />
                {cal}
              </label>
            ))
          )}
        </div>
      </div>
    </div>
  );
}