import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { semuaPaket } from "../lib/sets.js";
import { ringkasRiwayat } from "../lib/storage.js";

const chip =
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium";

const PILIHAN_JUMLAH = [5, 10, 15, 20, 25, 30];
const PILIHAN_WAKTU = [10, 15, 20, 30, 40, 45, 50, 60, 75];
export const MAKS_SOAL = 30;
export const MAKS_MENIT = 75;

const selectCls =
  "w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm font-semibold dark:border-slate-700 dark:bg-slate-900";

function opsiJumlah(scorable) {
  const batas = Math.min(MAKS_SOAL, scorable);
  const daftar = PILIHAN_JUMLAH.filter((x) => x < batas);
  daftar.push(batas);
  return [...new Set(daftar)];
}

function PaketCard({ p, riwayat }) {
  const scorable = p.jumlah - p.tanpaKunci;
  const [n, setN] = useState(Math.min(MAKS_SOAL, scorable));
  const w0 = Number(p.meta?.waktu);
  const [t, setT] = useState(
    Number.isFinite(w0) && PILIHAN_WAKTU.includes(Math.min(MAKS_MENIT, w0))
      ? Math.min(MAKS_MENIT, w0)
      : 30,
  );

  const r = riwayat[p.slug];

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <span className={`${chip} bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300`}>
            {p.mapel}
            {p.tahun ? ` · ${p.tahun}` : ""}
          </span>
          <h2 className="mt-1.5 font-bold leading-snug">{p.judul}</h2>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            {scorable} soal siap dinilai
            {p.tanpaKunci > 0
              ? ` · ${p.tanpaKunci} tanpa kunci (lewat)`
              : ""}
            {r ? ` · terakhir ${r.last.nilai}%, terbaik ${r.best}%` : ""}
          </p>
        </div>
      </div>

      {scorable === 0 ? (
        <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
          Belum ada kunci jawaban di paket ini — mulai soal disabled sampai kunci
          dilampirkan di berkas .md.
        </p>
      ) : (
        <div className="mt-3 grid grid-cols-2 gap-2 sm:max-w-md">
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">
              Jumlah soal
            </span>
            <select
              className={selectCls}
              value={n}
              onChange={(e) => setN(Number(e.target.value))}
            >
              {opsiJumlah(scorable).map((x) => (
                <option key={x} value={x}>
                  {x === scorable && scorable <= MAKS_SOAL ? `Semua (${x})` : x}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">
              Waktu (menit)
            </span>
            <select
              className={selectCls}
              value={t}
              onChange={(e) => setT(Number(e.target.value))}
            >
              {PILIHAN_WAKTU.map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}

      <div className="mt-3">
        <Link
          to={
            scorable > 0
              ? `/paket/${p.slug}?n=${n}&t=${t}`
              : `/paket/${p.slug}`
          }
          aria-disabled={scorable === 0}
          className={
            scorable > 0
              ? "block rounded-lg bg-brand px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-brand-strong sm:inline-block sm:min-w-40"
              : "block cursor-not-allowed rounded-lg bg-slate-200 px-4 py-2.5 text-center text-sm font-semibold text-slate-400 dark:bg-slate-800 sm:inline-block sm:min-w-40"
          }
        >
          Mulai {scorable > 0 ? `(${n} soal · ${t} mnt)` : "(tanpa kunci)"}
        </Link>
      </div>
    </article>
  );
}

export default function HomePage() {
  const paket = useMemo(() => semuaPaket(), []);
  const riwayat = useMemo(() => ringkasRiwayat(), []);
  const totalSoal = paket.reduce((a, p) => a + p.jumlah, 0);

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
          Latihan TKA
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Pilih paket, atur <b>jumlah soal</b> dan <b>waktu</b> (maks 30 soal ·
          75 menit), lalu kerjakan.
          Urutan soal diacak setiap sesi — di akhir kamu cuma lihat
          <b> persentase nilai</b>, tanpa kunci jawaban dibocorkan.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-slate-600 dark:text-slate-400">
          <span className={`${chip} bg-brand-soft text-brand-strong dark:bg-slate-800 dark:text-brand-soft`}>
            {paket.length} paket
          </span>
          <span className={`${chip} bg-brand-soft text-brand-strong dark:bg-slate-800 dark:text-brand-soft`}>
            {totalSoal} soal
          </span>
          <span className={`${chip} bg-brand-soft text-brand-strong dark:bg-slate-800 dark:text-brand-soft`}>
            {Object.values(riwayat).reduce((a, r) => a + r.jumlahDikerjakan, 0)}{" "}
            kali dikerjakan
          </span>
        </div>
      </section>

      {paket.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-500 dark:border-slate-700">
          Belum ada paket soal. Letakkan berkas <code>.md</code> di folder{" "}
          <code>content/soal/</code>, lalu jalankan ulang build.
        </div>
      ) : (
        <section className="space-y-3">
          {paket.map((p) => (
            <PaketCard key={p.slug} p={p} riwayat={riwayat} />
          ))}
        </section>
      )}

      <section className="rounded-xl bg-slate-100 p-4 text-sm text-slate-600 dark:bg-slate-900 dark:text-slate-400">
        <h3 className="font-semibold text-slate-800 dark:text-slate-200">
          Cara menambah paket
        </h3>
        <p className="mt-1">
          Simpan hasil konversi PDF ke Markdown sebagai satu berkas per paket di{" "}
          <code>content/soal/nama-paket.md</code>. Format yang dikenali: nomor
          soal <code>1.</code>, opsi <code>A.</code> sampai <code>E.</code>,
          kunci per soal <code>Kunci: X</code> atau daftar <code>1. B</code> di
          akhir, dan <code>Pembahasan: ...</code> (opsional). Front matter
          opsional: <code>judul</code>, <code>mapel</code>, <code>tahun</code>,{" "}
          <code>waktu</code> (menit, jadi default pilihan waktu). Detail lengkap
          ada di README repo.
        </p>
      </section>
    </div>
  );
}
