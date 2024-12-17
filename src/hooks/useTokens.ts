import { useState, useEffect } from "react";

export function useTokens() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  useEffect(() => {
    const hash = window.location.hash;
    console.log("Hash da URL:", hash); // Logando o hash completo

    if (hash) {
      const urlParams = new URLSearchParams(hash.substring(1));
      console.log("Parâmetros extraídos:", Array.from(urlParams.entries())); // Logando os parâmetros extraídos

      const access_token = urlParams.get('/user/update-password#access_token');
      const refresh_token = urlParams.get('refresh_token');

      console.log("Access Token:", access_token); // Logando o access_token extraído
      console.log("Refresh Token:", refresh_token); // Logando o refresh_token extraído

      setAccessToken(access_token);
      setRefreshToken(refresh_token);
    }
  }, []);

  return { accessToken, refreshToken };
}
