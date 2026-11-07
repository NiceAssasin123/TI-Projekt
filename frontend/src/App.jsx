import { useState } from 'react';
import { Navbar } from "./components/Navbar";
import { ProductCard } from "./components/ProductCard";

const products = [
  { id: 1, name: 'Pistolet Alpha 9mm', price: 2400, category: 'Krótka' },
  { id: 2, name: 'Karabinek AR-15 Tactical', price: 6500, category: 'Długa' },
  { id: 3, name: 'Strzelba Pump-Action 12GA', price: 1800, category: 'Gładkolufowa' },
];

function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        
        {filteredProducts.length === 0 ? (
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