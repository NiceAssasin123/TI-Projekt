import { useEffect, useState } from "react";
import { Search, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";

const PRICE_STEP = 10;

const PRICE_INPUT_CLASS =
  "pr-8 text-sm [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none";

const RANGE_INPUT_CLASS =
  "pointer-events-none absolute inset-0 h-full w-full appearance-none bg-transparent " +
  "[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 " +
  "[&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full " +
  "[&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-zinc-950 [&::-webkit-slider-thumb]:bg-red-500 " +
  "[&::-webkit-slider-thumb]:shadow [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110 " +
  "[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 " +
  "[&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 " +
  "[&::-moz-range-thumb]:border-zinc-950 [&::-moz-range-thumb]:bg-red-500 [&::-moz-range-thumb]:shadow";

export function ProductFilters({
  filters,
  onFilterChange,
  onClearFilters,
  hasActiveFilters = false,
}) {
  const [categories, setCategories] = useState([]);
  const [calibers, setCalibers] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [priceBounds, setPriceBounds] = useState({ min: 0, max: 0 });
  const [loadingFilters, setLoadingFilters] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchFilterOptions = async () => {
      try {
        const response = await api.get("/products/filters");
        if (isMounted) {
          const rawMin = Number(response.data.min_price) || 0;
          const rawMax = Number(response.data.max_price) || 0;

          setCategories(response.data.categories || []);
          setCalibers(response.data.calibers || []);
          setManufacturers(response.data.manufacturers || []);
          setPriceBounds({
            min: Math.floor(rawMin / PRICE_STEP) * PRICE_STEP,
            max: Math.ceil(rawMax / PRICE_STEP) * PRICE_STEP,
          });
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

  // Obliczenia dla podwójnego suwaka cenowego
  const hasPriceRange = priceBounds.max > priceBounds.min;
  const parsedMin =
    filters.min_price !== "" && filters.min_price != null
      ? Number(filters.min_price)
      : priceBounds.min;
  const parsedMax =
    filters.max_price !== "" && filters.max_price != null
      ? Number(filters.max_price)
      : priceBounds.max;

  const clampedMin = Number.isFinite(parsedMin)
    ? Math.min(Math.max(parsedMin, priceBounds.min), priceBounds.max)
    : priceBounds.min;
  const clampedMax = Number.isFinite(parsedMax)
    ? Math.min(Math.max(parsedMax, priceBounds.min), priceBounds.max)
    : priceBounds.max;

  const minThumbVal = Math.min(clampedMin, clampedMax);
  const maxThumbVal = Math.max(clampedMin, clampedMax);

  const rangeSpan = priceBounds.max - priceBounds.min;
  const leftPercent = hasPriceRange
    ? ((minThumbVal - priceBounds.min) / rangeSpan) * 100
    : 0;
  const rightPercent = hasPriceRange
    ? ((maxThumbVal - priceBounds.min) / rangeSpan) * 100
    : 100;

  const handleMinSliderChange = (e) => {
    const value = Math.min(Number(e.target.value), maxThumbVal);
    onFilterChange("min_price", value <= priceBounds.min ? "" : String(value));
  };

  const handleMaxSliderChange = (e) => {
    const value = Math.max(Number(e.target.value), minThumbVal);
    onFilterChange("max_price", value >= priceBounds.max ? "" : String(value));
  };

  const handlePriceInputChange = (key, rawValue) => {
    if (rawValue === "") {
      onFilterChange(key, "");
      return;
    }
    const parsed = Number(rawValue);
    if (!Number.isNaN(parsed) && parsed >= 0) {
      onFilterChange(key, rawValue);
    }
  };

  return (
    <div className="flex flex-col gap-6 rounded-xl border border-zinc-800 bg-zinc-900/30 p-5">
      {hasActiveFilters && onClearFilters && (
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">
            Aktywne filtry
          </span>
          <button
            type="button"
            onClick={onClearFilters}
            className="inline-flex cursor-pointer items-center gap-1 text-xs text-red-400 transition-colors hover:text-red-300"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Wyczyść
          </button>
        </div>
      )}

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

      {/* Sekcja Zakresu Cen */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-medium text-zinc-200">Cena (PLN)</h3>
          {!loadingFilters && hasPriceRange && (
            <span className="text-xs text-zinc-400">
              {minThumbVal} – {maxThumbVal} zł
            </span>
          )}
        </div>

        {loadingFilters ? (
          <p className="text-xs text-zinc-500">Ładowanie zakresu cen...</p>
        ) : !hasPriceRange ? (
          <p className="text-xs text-zinc-500">Brak danych cenowych</p>
        ) : (
          <div className="space-y-4">
            {/* Podwójny suwak */}
            <div className="relative flex h-5 items-center">
              <div className="h-1.5 w-full rounded-full bg-zinc-800" />
              <div
                className="absolute h-1.5 rounded-full bg-red-500"
                style={{
                  left: `${leftPercent}%`,
                  width: `${Math.max(rightPercent - leftPercent, 0)}%`,
                }}
              />

              <input
                type="range"
                aria-label="Cena minimalna"
                min={priceBounds.min}
                max={priceBounds.max}
                step={PRICE_STEP}
                value={minThumbVal}
                onChange={handleMinSliderChange}
                className={`${RANGE_INPUT_CLASS} ${
                  leftPercent > 85 ? "z-20" : "z-10"
                }`}
              />
              <input
                type="range"
                aria-label="Cena maksymalna"
                min={priceBounds.min}
                max={priceBounds.max}
                step={PRICE_STEP}
                value={maxThumbVal}
                onChange={handleMaxSliderChange}
                className={`${RANGE_INPUT_CLASS} ${
                  leftPercent > 85 ? "z-10" : "z-20"
                }`}
              />
            </div>

            {/* Pola liczbowe Od - Do */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Input
                  type="number"
                  min={0}
                  step={PRICE_STEP}
                  aria-label="Cena od"
                  placeholder={String(priceBounds.min)}
                  value={filters.min_price ?? ""}
                  onChange={(e) =>
                    handlePriceInputChange("min_price", e.target.value)
                  }
                  className={PRICE_INPUT_CLASS}
                />
                <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-zinc-500">
                  zł
                </span>
              </div>

              <span className="text-zinc-500">–</span>

              <div className="relative flex-1">
                <Input
                  type="number"
                  min={0}
                  step={PRICE_STEP}
                  aria-label="Cena do"
                  placeholder={String(priceBounds.max)}
                  value={filters.max_price ?? ""}
                  onChange={(e) =>
                    handlePriceInputChange("max_price", e.target.value)
                  }
                  className={PRICE_INPUT_CLASS}
                />
                <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-zinc-500">
                  zł
                </span>
              </div>
            </div>
          </div>
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

      {/* Sekcja Producentów */}
      <div>
        <h3 className="mb-3 text-sm font-medium text-zinc-200">Producent</h3>
        <div className="flex flex-col gap-2">
          {loadingFilters ? (
            <p className="text-xs text-zinc-500">Ładowanie producentów...</p>
          ) : manufacturers.length === 0 ? (
            <p className="text-xs text-zinc-500">Brak dostępnych producentów</p>
          ) : (
            manufacturers.map((man) => (
              <label
                key={man}
                className="flex cursor-pointer items-center gap-3 text-sm text-zinc-400 hover:text-zinc-200"
              >
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-red-500 focus:ring-red-500/20"
                  checked={(filters.manufacturer || []).includes(man)}
                  onChange={(e) =>
                    handleArrayFilter("manufacturer", man, e.target.checked)
                  }
                />
                {man}
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