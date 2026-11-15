import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Strona nie istnieje</h1>
      <Link
        to="/"
        className="inline-block text-zinc-400 hover:text-zinc-100 underline underline-offset-4 transition-colors"
      >
        Wróć na stronę główną
      </Link>
    </div>
  );
}