import { ThemeProvider } from "next-themes";
import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import ProntuariosPage from "@/pages/prontuarios";
import DocsPage from "@/pages/docs";
import PricingPage from "@/pages/pricing";
import BlogPage from "@/pages/blog";
import AboutPage from "@/pages/about";
import CadastroPage from "@/pages/cadastro";

function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route element={<IndexPage />} path="/" />
        <Route element={<DocsPage />} path="/docs" />
        <Route element={<PricingPage />} path="/pricing" />
        <Route element={<BlogPage />} path="/blog" />
        <Route element={<AboutPage />} path="/about" />
        <Route element={<CadastroPage />} path="/cadastro" />
        <Route element={<ProntuariosPage />} path="/prontuarios" />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
