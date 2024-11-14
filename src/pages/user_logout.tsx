import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const Logout: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      await supabase.auth.signOut();
      navigate("/user/login"); // Redireciona para a página de login
    };

    logout();
  }, [navigate]);

  return <p>Fazendo logout...</p>;
};

export default Logout;
