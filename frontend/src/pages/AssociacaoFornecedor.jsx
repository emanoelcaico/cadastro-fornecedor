import { useEffect, useState } from "react";
import {
  listarFornecedores,
  buscarProduto,
  associarFornecedor,
  desassociarFornecedor,
} from "../services/api";
import "./AssociacaoFornecedor.css";

export default function AssociacaoFornecedor({ produtoId, onClose }) {
  const [produto, setProduto] = useState(null);
  const [fornecedores, setFornecedores] = useState([]);
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState("");
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregar() {
      try {
        const [resProduto, resFornecedores] = await Promise.all([
          buscarProduto(produtoId),
          listarFornecedores(),
        ]);
        setProduto(resProduto.data);
        setFornecedores(resFornecedores.data);
      } catch (err) {
        console.error(err);
        setMensagem("Erro ao carregar dados.");
        setTipoMensagem("erro");
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, [produtoId]);

  async function handleAssociar() {
    console.log('🖱️ handleAssociar chamado. fornecedorSelecionado =', fornecedorSelecionado);

    if (!fornecedorSelecionado) {
      console.log('⚠️ fornecedorSelecionado está vazio!');
      setMensagem("Selecione um fornecedor.");
      setTipoMensagem("erro");
      return;
    }

    try {
      const { data } = await associarFornecedor(produtoId, fornecedorSelecionado);
      setMensagem(data.mensagem);
      setTipoMensagem("sucesso");
      setFornecedorSelecionado("");

      const { data: atualizado } = await buscarProduto(produtoId);
      setProduto(atualizado);
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.mensagem ||
        "Erro ao associar fornecedor. Tente novamente.";
      setMensagem(msg);
      setTipoMensagem("erro");
    }
  }

  async function handleDesassociar(fornecedorId) {
    if (!window.confirm("Deseja desassociar este fornecedor?")) return;

    try {
      const { data } = await desassociarFornecedor(produtoId, fornecedorId);
      setMensagem(data.mensagem);
      setTipoMensagem("sucesso");

      const { data: atualizado } = await buscarProduto(produtoId);
      setProduto(atualizado);
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.mensagem ||
        "Erro ao desassociar fornecedor. Tente novamente.";
      setMensagem(msg);
      setTipoMensagem("erro");
    }
  }

  const idsAssociados = produto?.fornecedores?.map((f) => f.id) || [];
  const fornecedoresDisponiveis = fornecedores.filter(
    (f) => !idsAssociados.includes(f.id)
  );

  if (carregando) {
    return (
      <div className="assoc-modal">
        <div className="assoc-container">
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="assoc-modal">
      <div className="assoc-container">
        <header className="assoc-header">
          <h2>Associação de Fornecedor a Produto</h2>
          <button
            type="button"
            className="btn-fechar"
            onClick={onClose}
            aria-label="Fechar"
          >
            ✕
          </button>
        </header>

        {mensagem && (
          <div className={`assoc-mensagem ${tipoMensagem}`}>{mensagem}</div>
        )}

        <section className="assoc-produto">
          <h3>Detalhes do Produto</h3>

          {produto?.imagem && (
            <img
              src={produto.imagem}
              alt={produto.nome}
              className="assoc-produto-img"
            />
          )}

          <div className="campo">
            <label>Nome do Produto</label>
            <input type="text" value={produto?.nome || ""} readOnly />
          </div>

          <div className="campo">
            <label>Código de Barras</label>
            <input type="text" value={produto?.codigoBarras || ""} readOnly />
          </div>

          <div className="campo">
            <label>Descrição</label>
            <textarea value={produto?.descricao || ""} readOnly rows={3} />
          </div>
        </section>

        <section className="assoc-form">
          <h3>Associar Novo Fornecedor</h3>

          <div className="assoc-linha">
            <select
              value={fornecedorSelecionado}
              onChange={(e) => {
                console.log('🎯 Select mudou para:', e.target.value);
                setFornecedorSelecionado(e.target.value);
              }}
            >
              <option value="">Selecione um fornecedor</option>
              {fornecedoresDisponiveis.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.nomeEmpresa} — {f.cnpj}
                </option>
              ))}
            </select>

            <button
              type="button"
              className="btn-associar"
              onClick={handleAssociar}
            >
              Associar Fornecedor
            </button>
          </div>
        </section>

        <section className="assoc-lista">
          <h3>Fornecedores Associados</h3>

          {!produto?.fornecedores?.length ? (
            <p className="sem-fornecedores">Nenhum fornecedor associado.</p>
          ) : (
            <table className="tabela-fornecedores">
              <thead>
                <tr>
                  <th>Nome do Fornecedor</th>
                  <th>CNPJ</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {produto.fornecedores.map((f) => (
                  <tr key={f.id}>
                    <td>{f.nomeEmpresa}</td>
                    <td>{f.cnpj}</td>
                    <td>
                      <button
                        type="button"
                        className="btn-desassociar"
                        onClick={() => handleDesassociar(f.id)}
                      >
                        Desassociar Fornecedor
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </div>
  );
}