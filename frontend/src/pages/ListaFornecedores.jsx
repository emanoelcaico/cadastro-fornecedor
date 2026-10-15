import { useEffect, useState } from "react";
import { listarFornecedores } from "../services/api";

export default function ListaFornecedores() {
  const [fornecedores, setFornecedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    listarFornecedores()
      .then(({ data }) => {
        setFornecedores(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setErro(err.response?.data?.mensagem || "Erro ao buscar fornecedores");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Carregando fornecedores...</p>;
  if (erro) return <p>❌ {erro}</p>;

  return (
    <div>
      <h2>Lista de Fornecedores</h2>
      {fornecedores.length === 0 ? (
        <p>Nenhum fornecedor cadastrado.</p>
      ) : (
        <ul>
          {fornecedores.map((f) => (
            <li key={f.id}>{f.nome}</li>
          ))}
        </ul>
      )}
    </div>
  );
}