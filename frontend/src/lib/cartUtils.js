// Przelicza łączną kwotę zamówienia w PLN z zaokrągleniem do groszy.
export function calculateCartTotal(items = []) {
  const total = items.reduce((sum, item) => {
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 0;
    return sum + price * quantity;
  }, 0);

  return Math.round(total * 100) / 100;
}

// Zlicza łączną liczbę sztuk wszystkich produktów w koszyku.
export function calculateCartItemCount(items = []) {
  return items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
}

// Formatuje kwotę do czytelnego zapisu w PLN (np. "4 500,00 zł").
export function formatPricePLN(amount) {
  const safeAmount = Number.isFinite(Number(amount)) ? Number(amount) : 0;
  const [integerPart, decimalPart] = safeAmount.toFixed(2).split('.');
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `${formattedInteger},${decimalPart} zł`;
}

// Sprawdza, czy którykolwiek produkt w koszyku wymaga pozwolenia na broń (promesy).
export function cartRequiresPermit(items = []) {
  return items.some((item) => Boolean(item.requires_permit));
}

// Mapuje bogaty stan koszyka na lekki payload zgodny z kontraktem POST /api/orders.
export function buildOrderPayload(items = [], hasPermitStatement = false) {
  const requiresPermit = cartRequiresPermit(items);

  return {
    items: items.map((item) => ({
      product_id: item.id,
      quantity: item.quantity,
    })),
    has_permit_statement: requiresPermit ? Boolean(hasPermitStatement) : false,
  };
}

// Wyciąga czytelny komunikat błędu z odpowiedzi FastAPI (400, 404, 422).
export function extractOrderErrorMessage(error) {
  const detail = error?.response?.data?.detail;

  if (typeof detail === 'string' && detail.trim()) {
    return detail;
  }

  if (Array.isArray(detail) && detail.length > 0) {
    return detail
      .map((entry) => entry?.msg)
      .filter(Boolean)
      .join(', ');
  }

  return 'Nie udało się złożyć rezerwacji. Spróbuj ponownie później.';
}