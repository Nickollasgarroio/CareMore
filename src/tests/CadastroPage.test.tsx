// src/tests/CadastroPage.test.tsx

import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

import CadastroPage from "@/pages/patient/patient_cadastro"; // Ajuste o caminho conforme necessário

// Mock do cliente Supabase
jest.mock("@/supabaseClient", () => ({
  supabase: {
    from: jest.fn(() => ({
      insert: jest.fn(() => Promise.resolve({ error: null })), // Simula um sucesso na inserção
    })),
  },
}));

describe("CadastroPage", () => {
  test("should open modal on successful submit", async () => {
    render(<CadastroPage />);

    // Preenche o formulário (ajuste os seletores conforme necessário)
    fireEvent.change(screen.getby("Digite seu Nome"), {
      target: { value: "Teste" },
    });
    fireEvent.change(screen.getByPlaceholderText("11 12345-6789"), {
      target: { value: "11123456789" },
    });
    // Adicione mais preenchimentos conforme necessário

    // Submete o formulário
    fireEvent.click(screen.getByText("Enviar"));

    // Verifica se o modal está aberto (ajuste o texto conforme a mensagem que espera ver)
    expect(
      await screen.findByText("Paciente cadastrado com sucesso!")
    ).toBeInTheDocument();
  });
});
