import { useMemo } from "react";
import { Link } from "react-router-dom";
import { semuaPaket } from "../lib/sets.js";
import { ringkasRiwayat } from "../lib/storage.js";

const chip =
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium";

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
          Siap Tes Kemampuan Akademik dengan mengerjakan soal per paket. Mode
          Latihan memberi pembahasan setiap soal; Mode Ujian menilai di akhir.
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
          {paket.map((p) => {
            const r = riwayat[p.slug];
            return (
              <article
                key={p.slug}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <span className={`${chip} bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300`}>
                      {p.mapel}
                      {p.tahun ? ` · ${p.tahun}` : ""}
                    </span>
                    <h2 className="mt-1.5 font-bold leading-snug">{p.judul}</h2>
                    <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                      {p.jumlah} soal
                      {p.tanpaKunci > 0
                        ? ` · ${p.tanpaKunci} soal tanpa kunci`
                        : ""}
                      {r
                        ? ` · terakhir ${r.last.nilai}, terbaik ${r.best}`
                        : ""}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <Link
                    to={`/paket/${p.slug}?mode=latih`}
                    className="flex-1 rounded-lg bg-brand px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-brand-strong sm:flex-none"
                  >
                    Mode Latihan
                  </Link>
                  <Link
                    to={`/paket/${p.slug}?mode=ujian`}
                    className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-center text-sm font-semibold transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800 sm:flex-none"
                  >
                    Mode Ujian
                  </Link>
                </div>
              </article>
            );
          })}
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
          kunci per soal <code>Kunci: B</code> atau daftar <code>1. B</code> di
          akhir, dan <code>Pembahasan: ...</code> (opsional). Detail lengkap ada
          di README repo.
        </p>
      </section>
    </div>
  );
}
