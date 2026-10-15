import { useEffect, useState } from "react";
import { listarFornecedores } from "../services/api";

export default function ListaFornecedores() {
  const [fornecedores, setFornecedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    listarFornecedores()
      .then(({ data }) => {
        console.log("🟢 Fornecedores recebidos:", data);
        setFornecedores(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("🔴 Erro:", err);
        setErro(err.response?.data?.mensagem || err.message || "Erro ao buscar fornecedores");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Carregando fornecedores...</p>;
  if (erro) return <p style={{ color: "red" }}>❌ {erro}</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Lista de Fornecedores</h2>

      <p style={{ color: "#666" }}>Total: {fornecedores.length}</p>

      {fornecedores.length === 0 ? (
        <p>Nenhum fornecedor cadastrado.</p>
      ) : (
        <ul>
          {fornecedores.map((f) => (
            <li key={f.id}>
              <strong>{f.nomeEmpresa || f.nome}</strong>
              {f.cnpj && <span> — CNPJ: {f.cnpj}</span>}
              {f.email && <span> — {f.email}</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}