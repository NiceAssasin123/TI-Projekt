import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  ImageOff,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useCartStore } from "@/store/useCartStore";
import {
  calculateCartTotal,
  formatPricePLN,
  cartRequiresPermit,
  buildOrderPayload,
  extractOrderErrorMessage,
} from "@/lib/cartUtils";

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);

  const [hasPermitStatement, setHasPermitStatement] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [reservation, setReservation] = useState(null);
  const [failedImages, setFailedImages] = useState({});

  const total = calculateCartTotal(items);
  const requiresPermit = cartRequiresPermit(items);

  const handleImageError = (productId) => {
    setFailedImages((prev) => ({ ...prev, [productId]: true }));
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (items.length === 0 || submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      const payload = buildOrderPayload(items, hasPermitStatement);
      const response = await api.post("/orders", payload);

      setReservation(response.data);
      clearCart();
      setHasPermitStatement(false);
    } catch (err) {
      console.error("Błąd składania rezerwacji:", err);
      setError(extractOrderErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  // Ekran potwierdzenia po otrzymaniu 201 Created
  if (reservation) {
    return (
      <div className="mx-auto max-w-2xl p-6 md:p-10">
        <div className="rounded-xl border border-emerald-500/30 bg-zinc-900/60 p-8 text-center">
          <CheckCircle2 className="mx-auto mb-4 h-14 w-14 text-emerald-500" />
          <h1 className="mb-2 text-2xl font-bold text-zinc-100">
            Rezerwacja została złożona!
          </h1>
          <p className="mb-6 text-sm text-zinc-400">
            Zachowaj poniższy kod odbioru i okaż go przy wizycie w sklepie.
            {reservation.has_permit_statement &&
              " Pamiętaj o zabraniu dokumentu promesy na broń palną."}
          </p>

          <div className="mb-6 rounded-lg border border-zinc-800 bg-zinc-950 p-5">
            <p className="mb-1 text-xs uppercase tracking-wider text-zinc-500">
              Kod rezerwacji
            </p>
            <p className="font-mono text-2xl font-bold tracking-wider text-emerald-400">
              {reservation.reservation_code}
            </p>
            <p className="mt-3 text-sm text-zinc-300">
              Kwota do zapłaty przy odbiorze:{" "}
              <span className="font-semibold text-white">
                {formatPricePLN(reservation.total_price)}
              </span>
            </p>
          </div>

          <Link
            to="/products"
            className="inline-flex items-center justify-center rounded-md bg-zinc-100 px-6 py-2.5 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-300"
          >
            Wróć do katalogu
          </Link>
        </div>
      </div>
    );
  }

  // Widok pustego koszyka
  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-4xl p-6 md:p-10">
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900/30 px-6 py-16 text-center">
          <ShoppingCart className="mb-4 h-12 w-12 text-zinc-600" />
          <h1 className="mb-2 text-2xl font-bold text-zinc-100">
            Twój koszyk jest pusty
          </h1>
          <p className="mb-6 text-sm text-zinc-400">
            Dodaj produkty z katalogu, aby przygotować rezerwację do odbioru w
            sklepie.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 rounded-md bg-zinc-100 px-5 py-2.5 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Przejdź do katalogu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link
            to="/products"
            className="mb-2 inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Kontynuuj zakupy
          </Link>
          <h1 className="text-3xl font-bold text-zinc-100">Twój koszyk</h1>
        </div>

        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            clearCart();
            setHasPermitStatement(false);
            setError(null);
          }}
          className="text-zinc-400 hover:bg-zinc-800 hover:text-red-400"
        >
          Wyczyść koszyk
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Lista produktów */}
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => {
            const showImage =
              Boolean(item.image_url) && !failedImages[item.id];
            const reachedStockLimit =
              item.in_stock > 0 && item.quantity >= item.in_stock;

            return (
              <div
                key={item.id}
                className="flex flex-col gap-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 sm:flex-row sm:items-center"
              >
                <Link
                  to={`/products/${item.id}`}
                  className="flex h-24 w-24 shrink-0 items-center justify-center rounded-lg bg-zinc-800/40 p-2"
                >
                  {showImage ? (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="h-full w-full object-contain"
                      onError={() => handleImageError(item.id)}
                    />
                  ) : (
                    <ImageOff className="h-8 w-8 text-zinc-600" />
                  )}
                </Link>

                <div className="flex-1">
                  <Link
                    to={`/products/${item.id}`}
                    className="font-semibold text-zinc-100 transition-colors hover:text-red-400"
                  >
                    {item.name}
                  </Link>

                  {item.requires_permit && (
                    <div className="mt-1 inline-flex items-center gap-1 rounded bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-400 ring-1 ring-inset ring-red-500/20">
                      <ShieldAlert className="h-3 w-3" />
                      Wymagane pozwolenie
                    </div>
                  )}

                  <p className="mt-1 text-sm text-zinc-400">
                    Cena jedn.: {formatPricePLN(item.price)}
                  </p>
                  {item.in_stock > 0 && (
                    <p className="text-xs text-zinc-500">
                      Dostępne w magazynie: {item.in_stock} szt.
                    </p>
                  )}
                </div>

                {/* Kontrola ilości i kwota pozycji */}
                <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                  <p className="text-lg font-bold text-white">
                    {formatPricePLN(item.price * item.quantity)}
                  </p>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center rounded-md border border-zinc-700 bg-zinc-950">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        aria-label={`Zmniejsz ilość: ${item.name}`}
                        className="p-2 text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>

                      <span className="min-w-[2rem] text-center text-sm font-medium text-zinc-100">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        disabled={reachedStockLimit}
                        aria-label={`Zwiększ ilość: ${item.name}`}
                        className="p-2 text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      aria-label={`Usuń z koszyka: ${item.name}`}
                      className="rounded-md p-2 text-zinc-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Podsumowanie i finalizacja */}
        <aside className="h-fit rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
          <h2 className="mb-4 text-lg font-semibold text-zinc-100">
            Podsumowanie rezerwacji
          </h2>

          <form onSubmit={handleSubmitOrder} className="space-y-5">
            <div className="space-y-2 border-b border-zinc-800 pb-4 text-sm">
              <div className="flex justify-between text-zinc-400">
                <span>Odbiór osobisty w sklepie</span>
                <span className="text-zinc-200">0,00 zł</span>
              </div>
              <div className="flex justify-between pt-2 text-base font-bold text-white">
                <span>Razem do zapłaty</span>
                <span>{formatPricePLN(total)}</span>
              </div>
            </div>

            {requiresPermit && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-red-400">
                  <ShieldAlert className="h-4 w-4 shrink-0" />
                  <span>Towar koncesjonowany w koszyku</span>
                </div>
                <label className="flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-zinc-300">
                  <input
                    type="checkbox"
                    checked={hasPermitStatement}
                    onChange={(e) => setHasPermitStatement(e.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-zinc-700 bg-zinc-900 text-red-500 focus:ring-red-500/20"
                  />
                  <span>
                    Oświadczam, że posiadam ważne pozwolenie na broń oraz
                    zaświadczenie uprawniające do nabycia broni (promesę),
                    które okażę przy odbiorze osobistym w sklepie.
                  </span>
                </label>
              </div>
            )}

            {error && (
              <div className="flex items-start gap-2 rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-400">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              disabled={submitting || (requiresPermit && !hasPermitStatement)}
              variant={requiresPermit ? "destructive" : "default"}
              className="w-full text-base"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Przetwarzanie...
                </>
              ) : (
                "Złóż rezerwację"
              )}
            </Button>

            {requiresPermit && !hasPermitStatement && (
              <p className="text-center text-xs text-zinc-500">
                Zaznacz oświadczenie o promesie, aby odblokować rezerwację.
              </p>
            )}
          </form>
        </aside>
      </div>
    </div>
  );
}