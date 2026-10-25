import { BrowserRouter, Route, Routes, useParams } from "react-router-dom";
import Header from "./components/Header.jsx";
import HomePage from "./pages/HomePage.jsx";
import QuizPage from "./pages/QuizPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

function QuizRoute() {
  // key={slug} memaksa remount saat pindah paket supaya state kuis reset.
  const { slug } = useParams();
  return <QuizPage key={slug} />;
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-dvh">
        <Header />
        <main className="mx-auto w-full max-w-3xl px-4 pb-16 pt-6 sm:pt-10">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/paket/:slug" element={<QuizRoute />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <footer className="border-t border-slate-200 py-6 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
          Latihan TKA — dibuat dengan React, Tailwind, dan berkas Markdown.
        </footer>
      </div>
    </BrowserRouter>
  );
}
