import { useEffect, useState } from "react";
import { listarProdutos, excluirProduto } from "../services/api";
import AssociacaoFornecedor from "./AssociacaoFornecedor";

export default function ListaProdutos() {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);

  async function carregar() {
    try {
      setCarregando(true);
      const { data } = await listarProdutos();
      setProdutos(data);
    } catch (err) {
      console.error(err);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  if (carregando) return <p style={{ padding: 20 }}>Carregando produtos...</p>;

  async function handleExcluir(id) {
    if (!window.confirm("Tem certeza que deseja excluir este produto?")) return;
    try {
      await excluirProduto(id);
      carregar(); // recarrega a lista
    } catch (err) {
      console.error(err);
      alert("Erro ao excluir produto.");
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Produtos Cadastrados</h1>

      {produtos.length === 0 ? (
        <p>Nenhum produto cadastrado ainda.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#fafafa" }}>
              <th style={{ padding: 10, textAlign: "left" }}>Nome</th>
              <th style={{ padding: 10, textAlign: "left" }}>Categoria</th>
              <th style={{ padding: 10, textAlign: "left" }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {produtos.map((p) => (
              <tr key={p.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: 10 }}>{p.nome}</td>
                <td style={{ padding: 10 }}>{p.categoria}</td>
               <td style={{ padding: 10 }}>
  <button
    onClick={() => setProdutoSelecionado(p.id)}
    style={{
      background: "#1976d2",
      color: "#fff",
      border: "none",
      padding: "6px 12px",
      borderRadius: 6,
      cursor: "pointer",
      marginRight: 8,
    }}
  >
    Associar Fornecedores
  </button>

  {/* 👇 BOTÃO NOVO AQUI 👇 */}
  <button
    onClick={() => handleExcluir(p.id)}
    style={{
      background: "#d32f2f",
      color: "#fff",
      border: "none",
      padding: "6px 12px",
      borderRadius: 6,
      cursor: "pointer",
    }}
  >
    Excluir
  </button>
</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {produtoSelecionado && (
        <AssociacaoFornecedor
          produtoId={produtoSelecionado}
          onClose={() => {
            setProdutoSelecionado(null);
            carregar();
          }}
        />
      )}
    </div>
  );
}