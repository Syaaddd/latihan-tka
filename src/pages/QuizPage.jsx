import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { cariPaket } from "../lib/sets.js";
import { simpanRiwayat } from "../lib/storage.js";
import Markdown from "../components/Markdown.jsx";
import { MAKS_SOAL, MAKS_MENIT } from "./HomePage.jsx";

const LABEL = ["A", "B", "C", "D", "E", "F"];

function acak(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function clamp(x, lo, hi) {
  if (!Number.isFinite(x)) return lo;
  return Math.min(Math.max(x, lo), hi);
}

function formatDetik(s) {
  const m = Math.floor(s / 60);
  const d = s % 60;
  return `${String(m).padStart(2, "0")}:${String(d).padStart(2, "0")}`;
}

export default function QuizPage() {
  const { slug } = useParams();
  const [params] = useSearchParams();
  const paket = useMemo(() => cariPaket(slug), [slug]);

  // Hanya soal berkunci yang masuk pool — biar nilai pasti terhitung.
  const pool = useMemo(
    () => (paket ? paket.soal.filter((s) => s.kunci) : []),
    [paket],
  );
  const maks = pool.length;

  // Batas sesi (permintaan Syadd, 26 Okt): maksimal 30 soal & 75 menit —
  // diacak dari seluruh pool tiap kali Mulai; link URL with n/t besar ikut dipangkas.
  const batasSoal = Math.min(MAKS_SOAL, maks);
  const jumlah = maks
    ? clamp(Number.parseInt(params.get("n"), 10) || batasSoal, 1, batasSoal)
    : 0;
  const menit = clamp(
    Number.parseInt(params.get("t"), 10) || Number(paket?.meta?.waktu) || 30,
    1,
    MAKS_MENIT,
  );

  const [urutan, setUrutan] = useState(() => acak(pool).slice(0, jumlah));
  const [jawaban, setJawaban] = useState(() => Array(jumlah).fill(null));

  // Paket dengan `pembahasan: ya` di front matter menampilkan kunci + cara
  // pengerjaan per soal SETELAH submit (permintaan Syadd, 27 Okt). Mapel lain
  // tetap hanya persentase.
  const pakaiPembahasan = /^(ya|true|1)$/i.test(paket?.meta?.pembahasan ?? "");
  const [idx, setIdx] = useState(0);
  const [sisa, setSisa] = useState(menit * 60);
  const [selesai, setSelesai] = useState(false);

  // Hitung mundur: tick tiap detik; detik terakhir otomatis mengumpulkan.
  useEffect(() => {
    if (selesai || maks === 0 || sisa <= 0) return;
    const id = setTimeout(() => {
      if (sisa === 1) {
        setSisa(0);
        setSelesai(true);
      } else {
        setSisa((s) => s - 1);
      }
    }, 1000);
    return () => clearTimeout(id);
  }, [sisa, selesai, maks]);

  // Kembali ke puncak saat pindah soal — wacana panjang bikin scroll nyangkut.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [idx]);

  const nilaiData = useMemo(() => {
    if (!selesai) return null;
    const benar = urutan.reduce(
      (n, s, i) => n + (jawaban[i] === s.kunci ? 1 : 0),
      0,
    );
    return {
      benar,
      total: urutan.length,
      nilai: Math.round((benar / Math.max(1, urutan.length)) * 100),
    };
  }, [selesai, urutan, jawaban]);

  // Riwayat disimpan sekali saat layar nilai muncul.
  useEffect(() => {
    if (selesai && nilaiData && urutan.length) {
      simpanRiwayat({
        slug,
        judul: paket?.judul,
        mode: "tryout",
        jumlah: urutan.length,
        waktu: menit,
        benar: nilaiData.benar,
        total: nilaiData.total,
        nilai: nilaiData.nilai,
        tanggal: new Date().toISOString(),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selesai]);

  function mulaiUlang() {
    setUrutan(acak(pool).slice(0, jumlah));
    setJawaban(Array(jumlah).fill(null));
    setIdx(0);
    setSisa(menit * 60);
    setSelesai(false);
    window.scrollTo({ top: 0 });
  }

  function selesaiManual() {
    const kosong = jawaban.filter((j) => j === null).length;
    if (
      kosong > 0 &&
      !window.confirm(
        `Masih ada ${kosong} soal belum dijawab. Selesaikan sekarang?`,
      )
    )
      return;
    setSelesai(true);
    window.scrollTo({ top: 0 });
  }

  if (!paket)
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-lg font-bold">Paket tidak ditemukan</h1>
        <p className="mt-1 text-sm text-slate-500">
          Slug <code>{slug}</code> tidak ada di folder <code>content/soal/</code>.
        </p>
        <Link
          to="/"
          className="mt-4 inline-block rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white"
        >
          Kembali ke Beranda
        </Link>
      </div>
    );

  if (maks === 0)
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-lg font-bold">Paket ini belum punya kunci jawaban</h1>
        <p className="mt-1 text-sm text-slate-500">
          Nilai tidak bisa dihitung. Tambahkan baris <code>Kunci: B</code> per
          soal atau daftar <code>Kunci Jawaban</code> di akhir berkas .md-nya.
        </p>
        <Link
          to="/"
          className="mt-4 inline-block rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white"
        >
          Kembali ke Beranda
        </Link>
      </div>
    );

  if (selesai && nilaiData)
    return (
      <div className="space-y-6">
        {sisa === 0 && (
          <p className="rounded-xl border border-bad/50 bg-red-50 px-4 py-2 text-center text-sm font-semibold text-red-700 dark:bg-red-950/40 dark:text-red-300">
            ⏰ Waktu habis! Jawaban yang terakhir terpilih ikut terkumpul.
          </p>
        )}
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-center dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <p className="text-sm text-slate-500">{paket.judul}</p>
          <p className="mt-3 text-6xl font-extrabold tracking-tight text-brand">
            {nilaiData.nilai}%
          </p>
          <p className="mt-2 text-sm text-slate-500">
            {nilaiData.benar} benar dari {nilaiData.total} soal · {menit} menit
          </p>
          <p className="mx-auto mt-4 max-w-sm text-xs text-slate-400">
            {pakaiPembahasan
              ? "Pembahasan dan kunci per soal tampil di bawah, urut sesuai sesi kamu barusan."
              : "Jawaban tidak ditampilkan di sini. Mulai sesi baru — soalnya otomatis diacak ulang supaya kamu benar-benar paham, bukan hafal urutan."}
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={mulaiUlang}
              className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-strong"
            >
              Coba Lagi (Diacak Ulang)
            </button>
            <Link
              to="/"
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold dark:border-slate-700"
            >
              Pilih Paket Lain
            </Link>
          </div>
        </div>

        {pakaiPembahasan && (
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              Pembahasan per Soal
            </h2>
            {urutan.map((s, i) => {
              const pilih = jawaban[i];
              const benar = pilih === s.kunci;
              return (
                <article
                  key={i}
                  className={`rounded-xl border bg-white p-4 dark:bg-slate-900 sm:p-5 ${
                    benar
                      ? "border-emerald-300 dark:border-emerald-800"
                      : "border-amber-300 dark:border-amber-800"
                  }`}
                >
                  <p className="mb-2 flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                    <span>Soal {i + 1}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        benar
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                      }`}
                    >
                      {benar
                        ? "✓ Benar"
                        : pilih == null
                          ? "• Kosong"
                          : `✗ Jawabanmu ${pilih}`}
                    </span>
                    <span className="rounded-full bg-emerald-600/10 px-2 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                      Kunci {s.kunci}
                    </span>
                  </p>
                  <div className="text-sm text-slate-800 dark:text-slate-100">
                    <Markdown>{s.teks}</Markdown>
                  </div>
                  <ul className="mt-3 space-y-1 text-sm">
                    {s.opsi.map((o) => (
                      <li
                        key={o.label}
                        className={
                          o.label === s.kunci
                            ? "font-semibold text-emerald-700 dark:text-emerald-300"
                            : "text-slate-600 dark:text-slate-300"
                        }
                      >
                        {o.label}. {o.teks}
                        {o.label === s.kunci ? " ✓" : ""}
                      </li>
                    ))}
                  </ul>
                  {s.pembahasan ? (
                    <div className="mt-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-700 dark:bg-slate-800/60 dark:text-slate-200">
                      <span className="font-semibold">Pembahasan: </span>
                      <Markdown>{s.pembahasan}</Markdown>
                    </div>
                  ) : (
                    <p className="mt-3 text-xs italic text-slate-400">
                      Pembahasan belum tersedia untuk soal ini — kuncinya tetap
                      tampil.
                    </p>
                  )}
                </article>
              );
            })}
          </section>
        )}
      </div>
    );

  const soal = urutan[idx];
  const terjawab = jawaban.filter((j) => j !== null).length;
  const mepet = sisa <= 60;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="truncate text-sm font-semibold text-brand">
            {paket.judul}
          </h1>
          <p className="text-xs text-slate-500">
            {pakaiPembahasan
              ? `${jumlah} soal acak · pembahasan tampil setelah submit · urutan beda tiap sesi`
              : `${jumlah} soal acak · kunci tidak ditampilkan · urutan beda tiap sesi`}
          </p>
        </div>
        <Link
          to="/"
          className="shrink-0 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold dark:border-slate-700"
        >
          Keluar
        </Link>
      </div>

      {/* Bilah status: timer + progres */}
      <div className="sticky top-[57px] z-10 flex items-center gap-3 rounded-xl border border-slate-200 bg-white/95 px-4 py-2.5 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
        <span
          className={
            "font-mono text-lg font-bold tabular-nums " +
            (mepet
              ? "animate-pulse text-bad"
              : "text-slate-800 dark:text-slate-100")
          }
          aria-label="Sisa waktu"
        >
          ⏱ {formatDetik(sisa)}
        </span>
        <div
          className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"
          role="progressbar"
          aria-valuenow={idx + 1}
          aria-valuemin={1}
          aria-valuemax={urutan.length}
        >
          <div
            className="h-full rounded-full bg-brand transition-all"
            style={{ width: `${((idx + 1) / urutan.length) * 100}%` }}
          />
        </div>
        <span className="text-xs text-slate-500">
          {terjawab}/{urutan.length} dijawab
        </span>
      </div>

      {/* Nomor soal (urutan acak sesi ini) */}
      <nav aria-label="Navigasi nomor soal" className="grid grid-cols-10 gap-1.5">
        {urutan.map((_, i) => {
          const aktif = i === idx;
          const dijawab = jawaban[i] !== null;
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

      {/* Kartu soal */}
      <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5">
        <div className="flex items-baseline gap-2">
          <span className="rounded-lg bg-brand px-2 py-0.5 text-sm font-bold text-white">
            {idx + 1}
          </span>
          <span className="text-xs text-slate-400">
            Soal {idx + 1} dari {urutan.length}
          </span>
        </div>
        <Markdown className="mt-3 text-[15px] sm:text-base">
          {soal.teks}
        </Markdown>

        <div className="mt-4 space-y-2">
          {soal.opsi.length === 0 ? (
            <p className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
              Soal ini tidak punya opsi A–E di berkas markdown.
            </p>
          ) : (
            soal.opsi.map((o, i) => {
              const label = o.label ?? LABEL[i] ?? "?";
              const dipilih = jawaban[idx] === label;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() =>
                    setJawaban((arr) => {
                      const b = [...arr];
                      b[idx] = label;
                      return b;
                    })
                  }
                  className={`flex w-full items-start gap-3 rounded-lg border p-3 text-left transition ${
                    dipilih
                      ? "border-brand bg-brand-soft/60 dark:bg-slate-800"
                      : "border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${
                      dipilih
                        ? "border-brand bg-brand text-white"
                        : "border-current"
                    }`}
                  >
                    {label}
                  </span>
                  <Markdown className="flex-1 text-[15px]">{o.teks}</Markdown>
                </button>
              );
            })
          )}
        </div>
      </article>

      {/* Aksi bawah */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setIdx(Math.max(0, idx - 1))}
          disabled={idx === 0}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold disabled:opacity-40 dark:border-slate-700"
        >
          ← Sebelumnya
        </button>
        {idx < urutan.length - 1 ? (
          <button
            type="button"
            onClick={() => setIdx((v) => Math.min(urutan.length - 1, v + 1))}
            className="flex-1 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-strong"
          >
            Lanjut →
          </button>
        ) : (
          <button
            type="button"
            onClick={selesaiManual}
            className="flex-1 rounded-lg bg-ok px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            Selesai & Lihat Nilai ✓
          </button>
        )}
        <button
          type="button"
          onClick={selesaiManual}
          className="rounded-lg border border-bad/60 px-3 py-2 text-xs font-semibold text-bad hover:bg-red-50 dark:hover:bg-red-950/40"
        >
          Kumpulkan
        </button>
      </div>
    </div>
  );
}
