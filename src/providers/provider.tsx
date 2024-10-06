import { NextUIProvider } from "@nextui-org/system";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useNavigate } from "react-router-dom";

export function Provider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  return (
    <NextUIProvider locale="pt-BR" navigate={navigate}>
      <NextThemesProvider>{children}</NextThemesProvider>
    </NextUIProvider>
  );
}
