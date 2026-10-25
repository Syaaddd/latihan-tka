# Latihan TKA

Website latihan soal Tes Kemampuan Akademik (TKA). Stack: Vite + React 19 +
Tailwind CSS v4, deploy statis ke Vercel. Soal ditulis dalam berkas Markdown
biasanya hasil konversi PDF → MD, tanpa perlu diubah ke JSON.

## Menjalankan lokal

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # hasil di dist/
npm run lint
```

## Menambah paket soal

1. Konversi PDF soal ke Markdown (tools apa pun: Adobe, marker, pandoc, dsb).
2. Simpan sebagai satu berkas per paket di `content/soal/<nama-paket>.md`.
   Nama berkas menjadi URL slug, contoh: `penalaran-numerik-paket-1.md`
   tampil di `/paket/penalaran-numerik-paket-1`.
3. Jalankan `npm run build` (di dev server, cukup simpan berkas).

Berkas baru otomatis terbundel saat build lewat `import.meta.glob`. Tidak ada
konfigurasi tambahan.

## Format Markdown yang dikenali parser

```markdown
---
judul: Penalaran Numerik — Paket 1
mapel: Penalaran Numerik
tahun: 2026
---

1. Hasil dari $2^{10} + 2^{10}$ adalah ...
A. $2^{11}$
B. $2^{20}$
C. $2^{10}$
D. $2^{9}$
E. $2^{12}$

Kunci: A

Pembahasan: $2^{10} + 2^{10} = 2 \times 2^{10} = 2^{11}$.
```

Aturan yang didukung (semua fleksibel, hasil konversi PDF tidak harus rapi):

- **Front matter** (opsional): `judul`, `mapel`, `tahun`, `waktu` (menit —
  jadi nilai default pilihan waktu di beranda). Tanpa front matter,
  judul diambil dari heading `#` pertama atau nama berkas; mapel default
  `Umum`.
- **Awal soal**: baris `1.` atau `1)` (juga `**1.**`). Teks soal boleh
  lebih dari satu baris; baris lanjutan otomatis digabung.
- **Opsi**: `A.` / `A)` / `(A)` sampai `E.` per baris. Bila konversi PDF
  mencetak opsi sebaris (`A. ... B. ... C. ...`), parser memecahnya otomatis.
- **Kunci** salah satu dari:
  - `Kunci: B` / `Jawaban: B` / `Kunci Jawaban: B` di bawah soal,
  - daftar di akhir berkas: `1. B`, `2. A`, ... (setelah baris `Kunci Jawaban`
    atau heading `## Kunci Jawaban`),
  - deretan `1-B 2-A 3-C`, atau baris tabel `| 1 | B |`.
- **Pembahasan**: `Pembahasan: ...` (opsional), multi-baris didukung.
- **Rumus**: `$...$` dan `$$...$$` dirender KaTeX. **Teks**: markdown GFM
  (tabel, list, tebal/miring) dirender apa adanya.
- **Teks pengantar** (mis. wacana "Bacalah teks berikut!") di atas soal nomor 1
  otomatis ditempel ke soal pertama. Untuk wacana yang dipakai beberapa soal,
  paling aman tempel di bawah nomor soal pertama.

Yang belum didukung (rencana): gambar/ilustrasi dari PDF (perlu diekstrak
manual ke `public/` dan ditaut `![alt](/nama.png)`) dan soal dengan lebih dari
satu opsi benar (format grid BENAR/SALAH khas TKA digital).

## Cara pakai

- Pilih paket di beranda → atur **jumlah soal** dan **waktu (menit)** → Mulai.
- Soal diambil acak dari pool dan **urutannya diacak tiap sesi** — jadi mengulang
  tidak sekadar menghafal urutan.
- Sesi berjalan seperti ujian: tanpa feedback per soal, timer hitung mundur,
  waktu habis = otomatis dikumpulkan.
- Layar hasil **hanya menampilkan persentase nilai** (dan jumlah benar). Kunci
  jawaban tidak pernah dibocorkan di layar nilai.
- Nilai terakhir & terbaik per paket tersimpan di `localStorage` browser
  (tanpa akun, tanpa server).

## Deploy

`vercel.json` sudah mengatur preset Vite, build `npm run build`, output `dist`,
dan rewrite SPA (`/paket/...` → `index.html`). Alur normal: push ke GitHub →
import repo di vercel.com → setiap push deploy otomatis.

## Struktur

```
content/soal/*.md        # satu berkas = satu paket soal
src/lib/soalParser.js    # parser markdown -> objek soal
src/lib/sets.js          # muat semua .md saat build
src/lib/storage.js       # riwayat nilai (localStorage)
src/pages/               # HomePage, QuizPage, NotFoundPage
src/components/          # Header, Markdown
```
