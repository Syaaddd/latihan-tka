import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkBreaks from "remark-breaks";
import rehypeKatex from "rehype-katex";

// Render teks soal/opsi sebagai markdown: dukung $...$ (KaTeX), list, tabel.
// remark-breaks: baris tunggal dalam teks soal (wacana, baris pertanyaan)
// menjadi ganti baris, bukan menempel jadi satu paragraf raksasa.
export default function Markdown({ children, className = "" }) {
  return (
    <div className={"md leading-relaxed " + className}>
      <ReactMarkdown
        remarkPlugins={[remarkMath, remarkGfm, remarkBreaks]}
        rehypePlugins={[[rehypeKatex, { throwOnError: false }]]}
      >
        {children || ""}
      </ReactMarkdown>
    </div>
  );
}
