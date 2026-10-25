import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

// Render teks soal/opsi sebagai markdown: dukung $...$ (KaTeX), list, tabel.
export default function Markdown({ children, className = "" }) {
  return (
    <div className={"leading-relaxed " + className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[[rehypeKatex, { throwOnError: false }]]}
      >
        {children || ""}
      </ReactMarkdown>
    </div>
  );
}
