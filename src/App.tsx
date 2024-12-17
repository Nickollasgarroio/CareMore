import { ThemeProvider } from "next-themes";
import { Route, Routes } from "react-router-dom";

import { AuthProvider } from "./providers/AuthProvider.tsx";

import DevMenu from "@/pages/dev_menu";
import ProntuariosPage from "@/pages/patient/patient_list.tsx";
import DocsPage from "@/pages/docs";
import PricingPage from "@/pages/pricing";
import BlogPage from "@/pages/blog";
import AboutPage from "@/pages/about";
import PatientCadastro from "@/pages/patient/patient_cadastro.tsx";
import UserLoginPage from "@/pages/user/user_login.tsx";
import UserCadastroPage from "@/pages/user/user_cadastro.tsx";
import UserProfileEditPage from "@/pages/user/user_profile.tsx";
import UserResetPasswordPage from "@/pages/user/user_reset_password.tsx";
import UserHomePage from "@/pages/user/user_home.tsx";
import Logout from "@/pages/user/user_logout.tsx";
import LoadingPage from "@/pages/loading.tsx";
import PacienteProntuario from "@/pages/patient/patient_prontuario.tsx";
import PatientEvolucaoCreatePage from "@/pages/patient/patient_evolucao_create.tsx";
import PatientEvolucaoListPage from "@/pages/patient/patient_evolucao_list.tsx";
import UserUpdatePasswordPage from "@/pages/user/user_update_password.tsx";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Routes>
          <Route element={<UserHomePage />} path="/" />
          <Route element={<DevMenu />} path="/dev_menu" />
          <Route element={<DocsPage />} path="/docs" />
          <Route element={<PricingPage />} path="/pricing" />
          <Route element={<BlogPage />} path="/blog" />
          <Route element={<AboutPage />} path="/about" />
          <Route element={<PatientCadastro />} path="/patient/create" />
          <Route element={<ProntuariosPage />} path="/patient/list" />
          <Route element={<UserLoginPage />} path="/login" />
          <Route element={<UserCadastroPage />} path="/user/cadastro" />
          <Route
            element={<UserResetPasswordPage />}
            path="/user/reset-password"
          />
          {/* <Route element={<UserHomePage />} path="/user/home" /> */}
          <Route
            element={<PatientEvolucaoCreatePage />}
            path="/patient/evolucao/create"
          />
          <Route
            element={<PatientEvolucaoListPage />}
            path="/patient/evolucao/list"
          />
          <Route element={<Logout />} path="/logout" />
          <Route element={<UserProfileEditPage />} path="/user/profile" />
          <Route element={<PacienteProntuario />} path="/patient/prontuario" />
          <Route element={<LoadingPage />} path="/loading" />
          <Route
            element={<UserUpdatePasswordPage />}
            path="/user/update-password"
          />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
