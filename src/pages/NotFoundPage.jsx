import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
      <h1 className="text-lg font-bold">Halaman tidak ditemukan</h1>
      <Link
        to="/"
        className="mt-4 inline-block rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}
