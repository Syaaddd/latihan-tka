const KEY = "tka-riwayat";

function adaStorage() {
  return typeof window !== "undefined" && !!window.localStorage;
}

export function bacaRiwayat() {
  if (!adaStorage()) return [];
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

export function simpanRiwayat(entry) {
  if (!adaStorage()) return;
  try {
    const daftar = [entry, ...bacaRiwayat()].slice(0, 300);
    localStorage.setItem(KEY, JSON.stringify(daftar));
  } catch {
    /* kuota penuh abaikan */
  }
}

// Ringkasan per paket: { slug: { best, last, jumlahDikerjakan } }
export function ringkasRiwayat() {
  const out = {};
  for (const r of bacaRiwayat()) {
    if (!r || !r.slug) continue;
    const s = out[r.slug] || { best: 0, last: null, jumlahDikerjakan: 0 };
    s.jumlahDikerjakan += 1;
    if (typeof r.nilai === "number" && r.nilai > s.best) s.best = r.nilai;
    if (!s.last) s.last = r; // daftar tersimpan terbaru-dulu
    out[r.slug] = s;
  }
  return out;
}
