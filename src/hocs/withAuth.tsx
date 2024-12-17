import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import { LoadingSpinner } from "../components/LoadingSpinner";

// Higher-Order Component
function withAuth<T extends object>(WrappedComponent: React.ComponentType<T>) {
  return function AuthProtected(props: T) {
    const { session, loading } = useAuth();

    // Enquanto a autenticação está sendo carregada, exibe uma tela de loading com animação
    if (loading) {
      return <LoadingSpinner />;
    }

    if (!session) {
      return <Navigate to="/login" replace />;
    }
    // Redireciona para a página de login se o usuário não estiver autenticado

    // Renderiza o componente protegido
    return <WrappedComponent {...props} />;
  };
}

export default withAuth;
