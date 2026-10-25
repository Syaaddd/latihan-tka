import { useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { cariPaket } from "../lib/sets.js";
import { simpanRiwayat } from "../lib/storage.js";
import Markdown from "../components/Markdown.jsx";

const OPTI_AKTIF =
  "border-brand bg-brand-soft/60 dark:bg-slate-800";
const OPTI_BENAR = "border-ok bg-green-50 dark:bg-green-950/40";
const OPTI_SALAH = "border-bad bg-red-50 dark:bg-red-950/40";
const OPTI_DIAM =
  "border-slate-200 dark:border-slate-700 opacity-70";

export default function QuizPage() {
  const { slug } = useParams();
  const [params] = useSearchParams();
  const mode = params.get("mode") === "ujian" ? "ujian" : "latih";
  const paket = useMemo(() => cariPaket(slug), [slug]);

  const [idx, setIdx] = useState(0);
  const [jawaban, setJawaban] = useState({});
  const [selesai, setSelesai] = useState(false);

  if (!paket) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-lg font-bold">Paket tidak ditemukan</h1>
        <p className="mt-1 text-sm text-slate-500">
          Slug <code>{slug}</code> tidak ada di folder{" "}
          <code>content/soal/</code>.
        </p>
        <Link
          to="/"
          className="mt-4 inline-block rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white"
        >
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  const total = paket.jumlah;
  const soal = paket.soal[idx];
  const terjawab = Object.keys(jawaban).length;

  const benarSoal = (i) => {
    const s = paket.soal[i];
    return s.kunci && jawaban[i] === s.kunci;
  };
  const jumlahBenar = () =>
    paket.soal.reduce((a, _s, i) => a + (benarSoal(i) ? 1 : 0), 0);

  const pilih = (label) => {
    if (mode === "latih" && jawaban[idx] !== undefined) return;
    setJawaban({ ...jawaban, [idx]: label });
  };

  const finish = () => {
    const benar = jumlahBenar();
    simpanRiwayat({
      slug: paket.slug,
      judul: paket.judul,
      mode,
      benar,
      total,
      nilai: Math.round((benar / total) * 100),
      tanggal: new Date().toISOString(),
    });
    setSelesai(true);
    window.scrollTo({ top: 0 });
  };

  const cobaLagi = () => {
    setJawaban({});
    setIdx(0);
    setSelesai(false);
  };

  const lanjut = () => {
    if (idx + 1 >= total) {
      finish();
    } else {
      setIdx(idx + 1);
      window.scrollTo({ top: 0 });
    }
  };

  const klikSelesai = () => {
    if (terjawab < total) {
      const sisa = total - terjawab;
      if (!window.confirm(`Masih ada ${sisa} soal belum dijawab. Selesaikan sekarang?`))
        return;
    }
    finish();
  };

  if (selesai) {
    const benar = jumlahBenar();
    const nilai = Math.round((benar / total) * 100);
    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-center dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500">
            {paket.judul} — {mode === "ujian" ? "Mode Ujian" : "Mode Latihan"}
          </p>
          <p className="mt-2 text-5xl font-extrabold text-brand">{nilai}</p>
          <p className="mt-1 text-sm text-slate-500">
            Benar {benar} dari {total} soal
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={cobaLagi}
              className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-strong"
            >
              Kerjakan Ulang
            </button>
            <Link
              to="/"
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold dark:border-slate-700"
            >
              Pilih Paket Lain
            </Link>
          </div>
        </div>

        <section className="space-y-3">
          <h2 className="font-bold">Telaah Jawaban</h2>
          {paket.soal.map((s, i) => {
            const ok = benarSoal(i);
            const belum = jawaban[i] === undefined;
            return (
              <article
                key={s.nomor}
                className={`rounded-xl border bg-white p-4 dark:bg-slate-900 ${
                  ok
                    ? "border-ok/60"
                    : belum
                      ? "border-slate-200 dark:border-slate-700"
                      : "border-bad/60"
                }`}
              >
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="font-bold">Soal {s.nomor}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      ok
                        ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                        : belum
                          ? "bg-slate-100 text-slate-500 dark:bg-slate-800"
                          : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"
                    }`}
                  >
                    {ok ? "Benar" : belum ? "Kosong" : "Salah"}
                  </span>
                </div>
                <Markdown className="mt-2 text-[15px]">{s.teks}</Markdown>
                <p className="mt-2 text-sm">
                  Jawabanmu:{" "}
                  <b className={ok ? "text-ok" : "text-bad"}>
                    {belum ? "—" : jawaban[i]}
                  </b>
                  {" · Kunci: "}
                  <b className="text-ok">{s.kunci || "belum ada"}</b>
                </p>
                {s.pembahasan && (
                  <details className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    <summary className="cursor-pointer font-semibold">
                      Pembahasan
                    </summary>
                    <Markdown className="mt-1">{s.pembahasan}</Markdown>
                  </details>
                )}
              </article>
            );
          })}
        </section>
      </div>
    );
  }

  const terjawabSoal = jawaban[idx];
  const sudahNilai = mode === "latih" && terjawabSoal !== undefined;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="truncate text-sm font-semibold text-brand">
            {paket.judul}
          </h1>
          <p className="text-xs text-slate-500">
            {mode === "ujian" ? "Mode Ujian — nilai di akhir" : "Mode Latihan"}{" "}
            · {terjawab}/{total} terjawab
          </p>
        </div>
        <Link
          to="/"
          className="shrink-0 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold dark:border-slate-700"
        >
          Keluar
        </Link>
      </div>

      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"
        role="progressbar"
        aria-valuenow={idx + 1}
        aria-valuemin={1}
        aria-valuemax={total}
      >
        <div
          className="h-full rounded-full bg-brand transition-all"
          style={{ width: `${((idx + 1) / total) * 100}%` }}
        />
      </div>

      {mode === "ujian" && (
        <nav
          aria-label="Navigasi nomor soal"
          className="grid grid-cols-10 gap-1.5"
        >
          {paket.soal.map((_, i) => {
            const aktif = i === idx;
            const dijawab = jawaban[i] !== undefined;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setIdx(i)}
                className={`rounded-md border py-1.5 text-xs font-semibold transition ${
                  aktif
                    ? "border-brand bg-brand text-white"
                    : dijawab
                      ? "border-brand/50 bg-brand-soft text-brand-strong dark:bg-slate-800 dark:text-brand-soft"
                      : "border-slate-200 text-slate-500 dark:border-slate-700"
                }`}
              >
                {i + 1}
              </button>
            );
          })}
        </nav>
      )}

      <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5">
        <div className="flex items-baseline gap-2">
          <span className="rounded-lg bg-brand px-2 py-0.5 text-sm font-bold text-white">
            {soal.nomor}
          </span>
          <span className="text-xs text-slate-400">
            Soal {idx + 1} dari {total}
          </span>
        </div>
        <Markdown className="mt-3 text-[15px] sm:text-base">{soal.teks}</Markdown>

        <div className="mt-4 space-y-2">
          {soal.opsi.map((o) => {
            let cls =
              "border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800";
            if (sudahNilai) {
              if (o.label === soal.kunci) cls = OPTI_BENAR;
              else if (o.label === terjawabSoal) cls = OPTI_SALAH;
              else cls = OPTI_DIAM;
            } else if (terjawabSoal === o.label) {
              cls = OPTI_AKTIF;
            }
            return (
              <button
                key={o.label}
                type="button"
                onClick={() => pilih(o.label)}
                className={`flex w-full items-start gap-3 rounded-lg border p-3 text-left transition ${cls}`}
              >
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-current text-xs font-bold">
                  {o.label}
                </span>
                <Markdown className="flex-1 text-[15px]">{o.teks}</Markdown>
              </button>
            );
          })}
        </div>

        {sudahNilai && (
          <div
            className={`mt-4 rounded-lg p-3 text-sm ${
              benarSoal(idx)
                ? "bg-green-50 text-green-800 dark:bg-green-950/40 dark:text-green-300"
                : "bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-300"
            }`}
          >
            <p className="font-bold">
              {benarSoal(idx)
                ? "Benar!"
                : soal.kunci
                  ? `Salah. Kunci: ${soal.kunci}`
                  : "Kunci belum tersedia di berkas soal."}
            </p>
            {soal.pembahasan && (
              <Markdown className="mt-1 text-slate-700 dark:text-slate-300">
                {soal.pembahasan}
              </Markdown>
            )}
          </div>
        )}
      </article>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setIdx(Math.max(0, idx - 1))}
          disabled={idx === 0}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold disabled:opacity-40 dark:border-slate-700"
        >
          ← Sebelumnya
        </button>
        {mode === "latih" ? (
          <button
            type="button"
            onClick={lanjut}
            disabled={!sudahNilai}
            className="flex-1 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-strong disabled:opacity-40"
          >
            {idx + 1 >= total ? "Selesai & Lihat Nilai" : "Lanjut →"}
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setIdx(Math.min(total - 1, idx + 1))}
              disabled={idx + 1 >= total}
              className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-strong disabled:opacity-40"
            >
              Berikutnya →
            </button>
            <button
              type="button"
              onClick={klikSelesai}
              className="rounded-lg border border-ok px-4 py-2 text-sm font-semibold text-ok"
            >
              Selesai Ujian
            </button>
          </>
        )}
      </div>
    </div>
  );
}
