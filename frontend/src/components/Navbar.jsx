import { ShoppingCart, Menu, Shield, Search } from 'lucide-react';
import { cn } from 'cn';
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from 'react-router-dom';

export function Navbar() {
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
              className="pl-9 bg-zinc-950 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-zinc-700"
            />
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <Link
            to="/cart"
            aria-label="Koszyk"
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "hover:bg-zinc-800 hover:text-zinc-100 relative"
            )}
          >
            <ShoppingCart className="w-5 h-5" />
          </Link>
          
          <Link
            to="/login"
            className={cn(
              buttonVariants(),
              "bg-zinc-100 text-zinc-950 hover:bg-zinc-300"
            )}
          >
            Zaloguj
          </Link>
        </div>
      </div>
    </nav>
  );
}