// Parser berkas .md soal latihan TKA.
// Satu berkas markdown di content/soal/ = satu paket soal.
// Konvensi format lengkap didokumentasikan di README.md.

const RE_SOAL =
  /^\s*(?:[-*+]\s+)?\*{0,2}\s*(\d{1,3})\s*[.)]\s*\*{0,2}\s+(.*\S)\s*$/;
const RE_OPSI = /^\s*\(?([A-E])\s*[.)\]]\s*(.*\S)?\s*$/;
const RE_KUNCI_LINE =
  /^\s*\*{0,2}\s*(?:kunci(?:\s*jawaban)?|kunci\s*soal|answer\s*key)\s*\*{0,2}\s*[:/]?\s*$/i;
const RE_KUNCI_INLINE =
  /^\s*\*{0,2}\s*(?:kunci(?:\s*jawaban)?|jawab(?:an)?|answer)\s*[:=]\s*\(?([A-E])\)?\*{0,2}\s*[.,]?\s*$/i;
const RE_PEMBAHASAN =
  /^\s*\*{0,2}\s*(?:pembahasan|solusi|penyelesaian|penjelasan)\s*[:–-]\s*(.*)$/i;
const RE_HEADING = /^\s{0,3}#{1,6}\s+(?:kunci.*|pembahasan.*)$/i;
const RE_KUNCI_BELAKANGAN = /^\(?(\*{0,2})([A-E])\*{0,2}\)?[.)]?$/;
const RE_KUNCI_RUNTUN =
  /^\s*(?:\d{1,3}\s*[-–—]\s*\(?[A-E]\)?[.,;]?\s*){2,}$/;
const RE_PASANGAN_RUNTUN = /(\d{1,3})\s*[-–—]\s*\(?([A-E])\)?/g;
const RE_KUNCI_TABLE = /^\|?\s*(\d{1,3})\s*\|\s*\*{0,2}([A-E])\*{0,2}\s*\|?\s*$/;

// Potongan teks "Kunci: B" yang nyempil di dalam blok soal.
const RE_KUNCI_REMAH =
  /(?:^|\n)[ \t]*\*{0,2}[ \t]*(?:kunci(?:[ \t]+jawaban)?|jawab(?:an)?)[\t ]*[:=][\t ]*\(?[A-E]\)?\*{0,2}[ \t]*(?=\n|$)/gi;

function pisahFrontMatter(raw) {
  const t = raw.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n");
  if (!t.startsWith("---\n")) return { meta: {}, body: t };
  const end = t.indexOf("\n---", 4);
  if (end === -1) return { meta: {}, body: t };
  const meta = {};
  for (const line of t.slice(4, end).split("\n")) {
    const m = /^\s*([A-Za-z_][\w-]*)\s*:\s*(.*?)\s*$/.exec(line);
    if (m) meta[m[1].toLowerCase()] = m[2].replace(/^["']|["']$/g, "");
  }
  return { meta, body: t.slice(end + 4) };
}

// Coba pecah opsi yang tercetak sebaris: "A. ... B. ... C. ..."
function pisahOpsiInline(teks, mulai = "A") {
  const re = /(^|[\s(])([A-E])\s*[.)\]]\s+/g;
  const temuan = [];
  let m;
  while ((m = re.exec(teks))) {
    temuan.push({
      label: m[2],
      mulai: m.index + m[1].length,
      akhir: m.index + m[0].length,
    });
  }
  const picks = [];
  let expect = mulai.charCodeAt(0);
  for (const f of temuan) {
    if (f.label.charCodeAt(0) === expect) {
      picks.push(f);
      expect += 1;
    }
  }
  if (picks.length < 2) return null;
  const opsi = picks.map((p, i) => ({
    label: p.label,
    teks: teks
      .slice(p.akhir, i + 1 < picks.length ? picks[i + 1].mulai : teks.length)
      .trim(),
  }));
  return { teks: teks.slice(0, picks[0].mulai).trim(), opsi };
}

function bacaBlok(body) {
  const lines = body.split("\n");
  const soalList = [];
  const keys = {};
  const intro = [];
  let cur = null;
  let curOpsi = null;
  let bagian = "teks";

  for (const line of lines) {
    const t = line.trim();

    // Judul bagian (mis. "## Kunci Jawaban") menutup blok aktif.
    if (RE_HEADING.test(line)) {
      cur = null;
      curOpsi = null;
      continue;
    }
    // Baris "Kunci Jawaban:" berdiri sendiri = awal tabel kunci.
    if (t && RE_KUNCI_LINE.test(t)) {
      cur = null;
      curOpsi = null;
      continue;
    }
    if (!t) continue;

    let m = RE_KUNCI_INLINE.exec(t);
    if (m) {
      if (cur) cur.kunci = m[1].toUpperCase();
      continue;
    }

    m = RE_PEMBAHASAN.exec(t);
    if (m && cur) {
      bagian = "pembahasan";
      curOpsi = null;
      const sisa = m[1].trim();
      if (sisa) cur.pembahasan.push(sisa);
      continue;
    }

    // Deretan kunci satu baris: "1-B 2-C 3-A"
    if (RE_KUNCI_RUNTUN.test(t)) {
      for (const p of t.matchAll(RE_PASANGAN_RUNTUN))
        keys[Number(p[1])] = p[2].toUpperCase();
      continue;
    }
    // Baris tabel kunci: "| 1 | B |"
    m = RE_KUNCI_TABLE.exec(t);
    if (m) {
      keys[Number(m[1])] = m[2].toUpperCase();
      continue;
    }

    m = RE_SOAL.exec(line);
    if (m) {
      const nomor = Number(m[1]);
      const isi = m[2].trim();
      // Blok "1. B" (cuma satu huruf) = entri tabel kunci, bukan soal.
      const lepas = RE_KUNCI_BELAKANGAN.exec(isi);
      if (lepas) {
        keys[nomor] = lepas[2];
        cur = null;
        curOpsi = null;
        continue;
      }
      const pengantar =
        !soalList.length && intro.length ? intro.join("\n\n") + "\n\n" : "";
      cur = {
        nomor,
        teks: pengantar + isi,
        opsi: [],
        kunci: null,
        pembahasan: [],
      };
      intro.length = 0;
      soalList.push(cur);
      curOpsi = null;
      bagian = "teks";
      continue;
    }

    m = RE_OPSI.exec(line);
    if (m && cur) {
      curOpsi = { label: m[1], teks: [] };
      if (m[2]) curOpsi.teks.push(m[2]);
      cur.opsi.push(curOpsi);
      bagian = "opsi";
      continue;
    }

    // Baris lanjutan: tempel ke bagian yang sedang terbuka.
    if (cur) {
      if (bagian === "pembahasan") cur.pembahasan.push(t);
      else if (bagian === "opsi" && curOpsi) curOpsi.teks.push(t);
      else cur.teks += "\n" + t;
    } else if (!soalList.length) {
      intro.push(t);
    }
  }

  const soal = [];
  for (const q of soalList) {
    let teks = q.teks.replace(RE_KUNCI_REMAH, "\n").trim();
    let opsi = q.opsi.map((o) => ({
      label: o.label,
      teks: o.teks.join(" ").trim(),
    }));
    if (opsi.length === 0) {
      const inline = pisahOpsiInline(teks);
      if (inline) {
        teks = inline.teks;
        opsi = inline.opsi;
      }
    } else if (opsi.length < 5 && opsi[0].label === "A") {
      // Opsi terlanjur tertangkap sebagian sebagai baris utuh
      // ("A. 4" lalu "B. 5 C. 6 D. 8 E. 12"). Susun ulang utuh lalu pecah.
      const gabung = opsi.map((o) => o.label + ". " + o.teks).join(" ");
      const inline = pisahOpsiInline(gabung);
      if (inline && inline.opsi.length > opsi.length) opsi = inline.opsi;
    }
    soal.push({
      nomor: q.nomor,
      teks,
      opsi,
      kunci: q.kunci,
      pembahasan: q.pembahasan.join("\n").trim() || null,
    });
  }
  for (const s of soal) if (!s.kunci) s.kunci = keys[s.nomor] || null;
  return { soal, keys };
}

function judulDariSlug(slug) {
  return slug
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^\w/, (c) => c.toUpperCase());
}

export function parseBerkasSoal(raw, slug) {
  const { meta, body } = pisahFrontMatter(raw);
  const { soal } = bacaBlok(body);
  const h1 = body.match(/^\s{0,3}#\s+(.+)$/m);
  const tanpaKunci = soal.filter((s) => !s.kunci).length;
  return {
    slug,
    judul: meta.judul || meta.title || (h1 ? h1[1].trim() : judulDariSlug(slug)),
    mapel: meta.mapel || meta.mata_pelajaran || meta.subject || "Umum",
    tahun: meta.tahun || meta.year || null,
    soal,
    jumlah: soal.length,
    tanpaKunci,
  };
}
