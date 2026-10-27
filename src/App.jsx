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
      </div>
    </BrowserRouter>
  );
}
