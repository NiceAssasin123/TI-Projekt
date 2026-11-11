import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Navbar } from "./components/Navbar";
import { ProductCard } from "./components/ProductCard";

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Pobieranie produktów z backendu API przy montowaniu komponentu
  useEffect(() => {
    let isMounted = true;

    fetch('http://127.0.0.1:8000/api/products')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Błąd serwera: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        if (isMounted) {
          setProducts(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error('Błąd podczas pobierania produktów:', err);
          setError('Nie udało się połączyć z serwerem. Upewnij się, że backend jest uruchomiony.');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Ponowna próba pobrania produktów po błędzie
  const handleRetry = () => {
    setLoading(true);
    setError(null);
    fetch('http://127.0.0.1:8000/api/products')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Błąd serwera: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Błąd podczas pobierania produktów:', err);
        setError('Nie udało się połączyć z serwerem. Upewnij się, że backend jest uruchomiony.');
        setLoading(false);
      });
  };

  // Funkcja dodająca produkt do koszyka
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  // Funkcja usuwająca lub zmniejszająca ilość produktu w koszyku
  const removeFromCart = (productId) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.id === productId) {
            return { ...item, quantity: item.quantity - 1 };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  };

  // Filtrowanie produktów na podstawie wyszukiwanej frazy
  const filteredProducts = products.filter((product) => {
    const query = searchQuery.toLowerCase();
    const nameMatch = product.name?.toLowerCase().includes(query);
    const categoryMatch = product.category?.toLowerCase().includes(query);
    const caliberMatch = product.caliber?.toLowerCase().includes(query);
    return Boolean(nameMatch || categoryMatch || caliberMatch);
  });

  // Całkowita liczba sztuk w koszyku
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  // Łączna cena
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      {/* Pasek nawigacji z obsługą koszyka i wyszukiwania */}
      <Navbar 
        cartCount={totalItems} 
        onCartClick={() => setIsCartOpen(!isCartOpen)}
        searchQuery={searchQuery}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Wysuwany panel koszyka */}
      {isCartOpen && (
        <div className="bg-zinc-900 border-b border-zinc-800 p-4 max-w-7xl mx-auto mb-6 rounded-b-lg shadow-xl">
          <h3 className="text-xl font-bold mb-4">Twój Koszyk</h3>
          {cart.length === 0 ? (
            <p className="text-zinc-400">Koszyk jest pusty.</p>
          ) : (
            <div>
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-3 border-b border-zinc-800">
                  <div>
                    <span className="font-semibold">{item.name}</span>
                    <span className="text-sm text-zinc-400 ml-2">(x{item.quantity})</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="font-bold">{item.price * item.quantity} PLN</span>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-400 text-sm font-semibold px-2 py-1 bg-zinc-950 border border-zinc-800 rounded transition-colors"
                    >
                      Usuń
                    </button>
                  </div>
                </div>
              ))}
              <div className="flex justify-between items-center mt-4 pt-3 font-bold text-lg border-t border-zinc-800">
                <span>Razem:</span>
                <span>{totalPrice} PLN</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Główna zawartość - lista przefiltrowanych produktów */}
      <main className="max-w-7xl mx-auto p-6 md:p-8">
        <h2 className="text-2xl font-bold mb-6 border-l-4 border-zinc-100 pl-3">
          {searchQuery ? `Wyniki wyszukiwania dla: "${searchQuery}"` : 'Dostępne modele'}
        </h2>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-zinc-400 space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-zinc-300" />
            <p className="text-base text-zinc-400">Ładowanie produktów...</p>
          </div>
        ) : error ? (
          <div className="bg-zinc-900 border border-red-900/50 rounded-lg p-6 text-center max-w-xl mx-auto my-8">
            <p className="text-red-400 font-semibold mb-2">Błąd podczas pobierania danych</p>
            <p className="text-sm text-zinc-400 mb-4">{error}</p>
            <button 
              onClick={handleRetry}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded text-sm font-semibold border border-zinc-700 transition-colors"
            >
              Spróbuj ponownie
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <p className="text-zinc-400">Brak produktów spełniających kryteria wyszukiwania.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={() => addToCart(product)} 
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;