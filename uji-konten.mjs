import { parseBerkasSoal } from "./src/lib/soalParser.js";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
const dir = "content/soal";
let gagal = 0;
for (const f of readdirSync(dir)) {
  const r = parseBerkasSoal(readFileSync(path.join(dir, f), "utf8"), f.replace(/\.md$/, ""));
  const tanpaOpsi = r.soal.filter(s => (s.opsi?.length ?? 0) < 2).map(s => s.nomor);
  const tanpaKunci = r.soal.filter(s => !s.kunci).map(s => s.nomor);
  const jelek = r.soal.filter(s => s.opsi && ![4,5].includes(s.opsi.length)).map(s => `${s.nomor}:${s.opsi.length}`);
  console.log(`${f}`);
  console.log(`  jumlah=${r.soal.length} tanpaOpsi=${JSON.stringify(tanpaOpsi)} tanpaKunci=${JSON.stringify(tanpaKunci)} opsiBukan45=${JSON.stringify(jelek)}`);
  console.log(`  meta=${JSON.stringify(r.meta)} kunciSemua=${r.soal.map(s=>s.kunci).join("")}`);
  if (tanpaOpsi.length || tanpaKunci.length || jelek.length) gagal++;
  // Guard wacana: stem pendek yg merujuk bacaan tanpa isi inline -> harus dicek manual
  const GANTUNG = /(teks|cerita|cerpen|kutipan|wacana|pengumuman|laporan|bacaan|drama|surat|iklan|dialog) (tersebut|di atas|itu)|berdasarkan (teks|cerita|kutipan|isi|wacana)|paragraf (pertama|kedua|ketiga|keempat|kelima)|terdapat pada nomor \.|peristiwa tersebut|kesimpulan yang sesuai teks/i;
  const INLINE = /Bacalah|Perhatikan|berikut!|[“"‘]|Teks ?\d|TEKS ?\d/;
  const gantung = r.soal.filter((s) => s.teks.length < 300 && GANTUNG.test(s.teks) && !INLINE.test(s.teks) && !(s.teks.includes("(") && s.teks.length >= 150)).map((s) => s.nomor);
  if (gantung.length) console.log(`  PERIKSA GANTUNG (stem merujuk bacaan tanpa isi): ${JSON.stringify(gantung)}`);
}
console.log(gagal ? `GAGAL ${gagal} berkas` : "SEMUA BERKAS OK");
