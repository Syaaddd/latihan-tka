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
}
console.log(gagal ? `GAGAL ${gagal} berkas` : "SEMUA BERKAS OK");
