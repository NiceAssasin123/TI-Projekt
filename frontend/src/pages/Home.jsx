import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center p-8 text-center">
      
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-500 ring-1 ring-red-500/20">
        <ShieldCheck className="h-8 w-8" />
      </div>

      <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-zinc-100 sm:text-5xl">
        Twój arsenał w <span className="text-red-500">jednym miejscu</span>
      </h1>
      
      <p className="mb-8 max-w-2xl text-lg text-zinc-400">
        Odkryj nasz pełen asortyment. Pistolety, karabiny, amunicja i akcesoria najwyższej jakości. Sprawdź, co dla Ciebie przygotowaliśmy.
      </p>

      <Link to="/products">
        <button className="flex items-center gap-2 rounded-md bg-red-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700">
          Przejdź do katalogu <ArrowRight className="h-4 w-4" />
        </button>
      </Link>

    </div>
  );
}