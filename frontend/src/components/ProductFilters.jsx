import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

// Przykładowe opcje filtrów (docelowo mogą też pochodzić z backendu)
const CATEGORIES = ["Pistolety", "Karabiny", "Strzelby", "Akcesoria", "Amunicja"];
const CALIBERS = ["9x19mm", ".45 ACP", "5.56x45mm", "12 Gauge", ".22 LR"];

export function ProductFilters({ filters, onFilterChange }) {
  // Funkcja pomocnicza do obsługi checkboxów (dodawanie/usuwanie elementów z tablicy)
  const handleArrayFilter = (key, value, isChecked) => {
    const currentList = filters[key] || [];
    const newList = isChecked
      ? [...currentList, value]
      : currentList.filter((item) => item !== value);
    onFilterChange(key, newList);
  };

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
            value={filters.search || ""}
            onChange={(e) => onFilterChange("search", e.target.value)}
          />
        </div>
      </div>

      {/* Sekcja Kategorii */}
      <div>
        <h3 className="mb-3 text-sm font-medium text-zinc-200">Kategorie</h3>
        <div className="flex flex-col gap-2">
          {CATEGORIES.map((cat) => (
            <label key={cat} className="flex cursor-pointer items-center gap-3 text-sm text-zinc-400 hover:text-zinc-200">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-red-500 focus:ring-red-500/20"
                checked={(filters.category || []).includes(cat)}
                onChange={(e) => handleArrayFilter("category", cat, e.target.checked)}
              />
              {cat}
            </label>
          ))}
        </div>
      </div>

      {/* Sekcja Kalibrów */}
      <div>
        <h3 className="mb-3 text-sm font-medium text-zinc-200">Kaliber</h3>
        <div className="flex flex-col gap-2">
          {CALIBERS.map((cal) => (
            <label key={cal} className="flex cursor-pointer items-center gap-3 text-sm text-zinc-400 hover:text-zinc-200">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-red-500 focus:ring-red-500/20"
                checked={(filters.caliber || []).includes(cal)}
                onChange={(e) => handleArrayFilter("caliber", cal, e.target.checked)}
              />
              {cal}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}