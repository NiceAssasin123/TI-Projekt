import { ShoppingCart, Menu, Shield, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from 'react-router-dom';

export function Navbar({ cartCount, onCartClick, searchQuery, onSearchChange }) {
  return (
    <nav className="bg-zinc-900 border-b border-zinc-800 p-4 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* LOGO - Oplecione Linkiem, wraca na stronę główną */}
        <div className="flex items-center space-x-2 w-full md:w-auto justify-between">
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <Shield className="w-8 h-8 text-zinc-100" />
              <span className="text-xl font-bold tracking-wider text-zinc-100">
                TACTICAL<span className="text-zinc-500">STORE</span>
              </span>
          </Link>
          <Menu className="w-6 h-6 hover:text-zinc-400 cursor-pointer transition-colors md:hidden" />
        </div>
        
        <div className="flex w-full md:max-w-md items-center space-x-2 relative">
           <Search className="w-4 h-4 absolute left-3 text-zinc-400" />
           <Input 
              type="search" 
              placeholder="Szukaj produktów..." 
              value={searchQuery}
              onChange={onSearchChange}
              className="pl-9 bg-zinc-950 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-zinc-700"
            />
        </div>

        <div className="hidden md:flex items-center space-x-4">
          
          {/* PRZYCISK KOSZYKA - Użyto Link jako (asChild) lub otoczono */}
          <Link to="/cart">
            <Button 
              variant="ghost" 
              size="icon" 
              className="hover:bg-zinc-800 hover:text-zinc-100 relative"
              onClick={onCartClick}
            >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
            </Button>
          </Link>
          
          {/* PRZYCISK ZALOGUJ - Opleciony Linkiem */}
          <Link to="/login">
            <Button className="bg-zinc-100 text-zinc-950 hover:bg-zinc-300">
                Zaloguj
            </Button>
          </Link>

        </div>
      </div>
    </nav>
  );
}