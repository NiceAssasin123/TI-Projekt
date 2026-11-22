import { useState } from 'react';
import { ShoppingCart, Menu, X, Shield, Search } from 'lucide-react';
import { cn } from 'cn';
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCartStore } from '@/store/useCartStore';
import { calculateCartItemCount } from '@/lib/cartUtils';

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const items = useCartStore((state) => state.items);
  const itemCount = calculateCartItemCount(items);

  const urlSearch =
    location.pathname === '/products'
      ? new URLSearchParams(location.search).get('search') || ''
      : '';

  const [searchInput, setSearchInput] = useState(urlSearch);
  const [prevUrlSearch, setPrevUrlSearch] = useState(urlSearch);

  if (urlSearch !== prevUrlSearch) {
    setPrevUrlSearch(urlSearch);
    setSearchInput(urlSearch);
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmed = searchInput.trim().slice(0, 50);

    if (trimmed) {
      navigate(`/products?search=${encodeURIComponent(trimmed)}`);
    } else {
      navigate('/products');
    }
    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const cartBadge = itemCount > 0 && (
    <span
      aria-label={`Liczba produktów w koszyku: ${itemCount}`}
      className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-600 px-1 text-[11px] font-bold text-white"
    >
      {itemCount > 99 ? '99+' : itemCount}
    </span>
  );

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-900 p-4">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">
        {/* LOGO + ikona koszyka i hamburger na mobile */}
        <div className="flex w-full items-center justify-between space-x-2 md:w-auto">
          <Link
            to="/"
            onClick={closeMobileMenu}
            className="flex items-center space-x-2 transition-opacity hover:opacity-80"
          >
            <Shield className="h-8 w-8 text-zinc-100" />
            <span className="text-xl font-bold tracking-wider text-zinc-100">
              TACTICAL<span className="text-zinc-500">STORE</span>
            </span>
          </Link>

          <div className="flex items-center gap-1 md:hidden">
            <Link
              to="/cart"
              onClick={closeMobileMenu}
              aria-label="Koszyk"
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "relative hover:bg-zinc-800 hover:text-zinc-100"
              )}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartBadge}
            </Link>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label={isMobileMenuOpen ? 'Zamknij menu' : 'Otwórz menu'}
              aria-expanded={isMobileMenuOpen}
              className="cursor-pointer rounded-md p-1.5 text-zinc-100 transition-colors hover:bg-zinc-800 hover:text-zinc-300"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Wyszukiwarka */}
        <form
          onSubmit={handleSearchSubmit}
          className="relative flex w-full items-center md:max-w-md"
        >
          <button
            type="submit"
            aria-label="Szukaj produktów"
            className="absolute left-3 cursor-pointer text-zinc-400 transition-colors hover:text-zinc-100"
          >
            <Search className="h-4 w-4" />
          </button>
          <Input
            type="search"
            maxLength={50}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Szukaj produktów..."
            className="border-zinc-800 bg-zinc-950 pl-9 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-zinc-700"
          />
        </form>

        {/* Nawigacja na desktopie */}
        <div className="hidden items-center space-x-4 md:flex">
          <Link
            to="/products"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "text-zinc-200 hover:bg-zinc-800 hover:text-zinc-100"
            )}
          >
            Katalog
          </Link>

          <Link
            to="/cart"
            aria-label="Koszyk"
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "relative hover:bg-zinc-800 hover:text-zinc-100"
            )}
          >
            <ShoppingCart className="h-5 w-5" />
            {cartBadge}
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

      {/* Rozwijane menu na mobile */}
      {isMobileMenuOpen && (
        <div className="mt-4 flex flex-col gap-2 border-t border-zinc-800 pt-4 md:hidden">
          <Link
            to="/products"
            onClick={closeMobileMenu}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "w-full justify-start text-zinc-200 hover:bg-zinc-800 hover:text-zinc-100"
            )}
          >
            Katalog
          </Link>

          <Link
            to="/login"
            onClick={closeMobileMenu}
            className={cn(
              buttonVariants(),
              "w-full bg-zinc-100 text-zinc-950 hover:bg-zinc-300"
            )}
          >
            Zaloguj
          </Link>
        </div>
      )}
    </nav>
  );
}