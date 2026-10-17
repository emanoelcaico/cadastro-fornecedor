import { useEffect, useState } from "react";
import { listarFornecedores, excluirFornecedor } from "../services/api";

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

  async function handleExcluir(id) {
    if (!window.confirm("Tem certeza que deseja excluir este fornecedor?")) return;
    try {
      await excluirFornecedor(id);
      // Recarrega a lista após excluir
      const { data } = await listarFornecedores();
      setFornecedores(data);
    } catch (err) {
      console.error(err);
      alert("Erro ao excluir fornecedor.");
    }
  }

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
      
      {/* 👇 BOTÃO NOVO AQUI 👇 */}
      <button
        onClick={() => handleExcluir(f.id)}
        style={{
          background: "#d32f2f",
          color: "#fff",
          border: "none",
          padding: "4px 10px",
          borderRadius: 4,
          cursor: "pointer",
          marginLeft: 10,
        }}
      >
        Excluir
      </button>
    </li>
  ))}
</ul>
      )}
    </div>
  );
}