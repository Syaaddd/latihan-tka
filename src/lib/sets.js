import { parseBerkasSoal } from "./soalParser.js";

// Semua .md di content/soal/ dibundel saat build (raw string, bukan HTTP).
const mentah = import.meta.glob("../../content/soal/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

const daftar = Object.entries(mentah)
  .map(([path, raw]) => {
    const slug = path.split("/").pop().replace(/\.md$/i, "");
    return parseBerkasSoal(raw, slug);
  })
  .filter((p) => p.jumlah > 0)
  .sort(
    (a, b) =>
      a.mapel.localeCompare(b.mapel, "id") ||
      a.judul.localeCompare(b.judul, "id"),
  );

export function semuaPaket() {
  return daftar;
}

export function cariPaket(slug) {
  return daftar.find((p) => p.slug === slug) || null;
}
