import { ThemeProvider } from "next-themes";
import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import ProntuariosPage from "@/pages/prontuarios";
import DocsPage from "@/pages/docs";
import PricingPage from "@/pages/pricing";
import BlogPage from "@/pages/blog";
import AboutPage from "@/pages/about";
import PatientCadastro from "@/pages/patient_cadastro";
import UserLoginPage from "@/pages/user_signin";
import UserCadastroPage from "@/pages/user_cadastro";
import UserResetPasswordPage from "@/pages/user_resetpassword";
import UserHomePage from "@/pages/user_home";

function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route element={<IndexPage />} path="/" />
        <Route element={<DocsPage />} path="/docs" />
        <Route element={<PricingPage />} path="/pricing" />
        <Route element={<BlogPage />} path="/blog" />
        <Route element={<AboutPage />} path="/about" />
        <Route element={<PatientCadastro />} path="/cadastro" />
        <Route element={<ProntuariosPage />} path="user/prontuarios" />
        <Route element={<UserLoginPage />} path="/user/login" />
        <Route element={<UserCadastroPage />} path="/user/cadastro" />
        <Route element={<UserResetPasswordPage />} path="/user/resetpassword" />
        <Route element={<UserHomePage />} path="/user/home" />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
