import { useState } from "react";
import { cadastrarFornecedor } from "../services/api";
import { mascaraCNPJ, mascaraTelefone } from "../utils/mascaras";
import CadastroProduto from "./CadastroProduto";
import { useNavigate } from "react-router-dom";
import "./CadastroFornecedor.css";

const estadoInicial = {
  nomeEmpresa: "",
  cnpj: "",
  endereco: "",
  telefone: "",
  email: "",
  contatoPrincipal: ""
};

export default function CadastroFornecedor() {
  const navigate = useNavigate(); // 👈 hook de navegação

  const [dados, setDados] = useState(estadoInicial);
  const [erros, setErros] = useState({});
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState("");

  const [mostrarProduto, setMostrarProduto] = useState(false);
  const [produtos, setProdutos] = useState([]);

  const handleSalvarProduto = (produto) => {
    console.log("Produto recebido do modal:", produto);
    setProdutos((prev) => [...prev, produto]);
    setMostrarProduto(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let novoValor = value;

    if (name === "cnpj") novoValor = mascaraCNPJ(value);
    if (name === "telefone") novoValor = mascaraTelefone(value);

    setDados((prev) => ({ ...prev, [name]: novoValor }));
    setErros((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErros({});
    setMensagem("");
    setTipoMensagem("");

    try {
      const payload = { ...dados, produtos };
      const { data } = await cadastrarFornecedor(payload);
      setMensagem(data.mensagem);
      setTipoMensagem("sucesso");
      setDados(estadoInicial);
      setProdutos([]);
    } catch (error) {
      console.error("❌ Erro completo:", error);
      console.error("📦 Resposta do backend:", error.response?.data);
      console.error("🔢 Status HTTP:", error.response?.status);

      const resp = error.response?.data;

      if (resp?.erros) {
        setErros(resp.erros);
        const primeiraMsg = Object.values(resp.erros)[0];
        setMensagem(primeiraMsg || "Erro de validação.");
        setTipoMensagem("erro");
      } else if (resp?.mensagem) {
        setMensagem(resp.mensagem);
        setTipoMensagem("erro");
      } else if (error.message === "Network Error") {
        setMensagem(
          "Não foi possível conectar ao servidor. Verifique se o backend está rodando em http://localhost:3001."
        );
        setTipoMensagem("erro");
      } else {
        setMensagem(`Erro: ${error.message || "desconhecido"}`);
        setTipoMensagem("erro");
      }
    }
  };

  return (
    <div className="container">
      <header className="cabecalho">
        <h1>Cadastro de Fornecedor de Elevadores</h1>
        <button
          type="button"
          className="btn-voltar"
          onClick={() => window.history.back()}
        >
          Voltar
        </button>
      </header>

      {mensagem && (
        <div className={`mensagem ${tipoMensagem}`}>{mensagem}</div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="campo">
          <label>Nome da Empresa *</label>
          <input
            type="text"
            name="nomeEmpresa"
            placeholder="Insira o nome da empresa"
            value={dados.nomeEmpresa}
            onChange={handleChange}
          />
          {erros.nomeEmpresa && <span className="erro">{erros.nomeEmpresa}</span>}
        </div>

        <div className="campo">
          <label>CNPJ *</label>
          <input
            type="text"
            name="cnpj"
            placeholder="00.000.000/0000-00"
            value={dados.cnpj}
            onChange={handleChange}
            maxLength={18}
          />
          {erros.cnpj && <span className="erro">{erros.cnpj}</span>}
        </div>

        <div className="campo">
          <label>Endereço *</label>
          <textarea
            name="endereco"
            placeholder="Insira o endereço completo da empresa"
            value={dados.endereco}
            onChange={handleChange}
            rows={3}
          />
          {erros.endereco && <span className="erro">{erros.endereco}</span>}
        </div>

        <div className="campo">
          <label>Telefone *</label>
          <input
            type="text"
            name="telefone"
            placeholder="(00) 00000-0000"
            value={dados.telefone}
            onChange={handleChange}
            maxLength={15}
          />
          {erros.telefone && <span className="erro">{erros.telefone}</span>}
        </div>

        <div className="campo">
          <label>E-mail *</label>
          <input
            type="email"
            name="email"
            placeholder="exemplo@fornecedor.com"
            value={dados.email}
            onChange={handleChange}
          />
          {erros.email && <span className="erro">{erros.email}</span>}
        </div>

        <div className="campo">
          <label>Contato Principal *</label>
          <input
            type="text"
            name="contatoPrincipal"
            placeholder="Nome do contato principal"
            value={dados.contatoPrincipal}
            onChange={handleChange}
          />
          {erros.contatoPrincipal && (
            <span className="erro">{erros.contatoPrincipal}</span>
          )}
        </div>

        <div className="acoes">
          <button type="submit" className="btn-cadastrar">
            Cadastrar
          </button>

          <button
            type="button"
            className="btn-cancelar"
            onClick={() => {
              setDados(estadoInicial);
              setErros({});
              setMensagem("");
            }}
          >
            Limpar
          </button>

          {/* 👇 Botões de consulta — DEPOIS do Limpar */}
          <button
            type="button"
            className="btn-consultar"
            onClick={() => navigate("/fornecedores")}
          >
            Consultar Fornecedores
          </button>

          <button
            type="button"
            className="btn-consultar-produtos"
            onClick={() => navigate("/produtos")}
          >
            Consultar Produtos
          </button>
        </div>
      </form>

      {/* Seção de Produtos */}
      <section className="secao-produtos">
        <div className="secao-produtos-header">
          <h2>Produtos do Fornecedor de Elevadores</h2>
          <button
            type="button"
            className="btn-add-produto"
            onClick={() => setMostrarProduto(true)}
          >
            + Adicionar Produto
          </button>
        </div>

        {produtos.length === 0 ? (
          <p className="sem-produtos">Nenhum produto cadastrado ainda.</p>
        ) : (
          <ul className="lista-produtos">
            {produtos.map((p, i) => (
              <li key={i}>
                <strong>{p.nome}</strong>
                {p.categoria && <span> — {p.categoria}</span>}
                {p.quantidade && <span> | Qtd: {p.quantidade}</span>}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Modal do Produto */}
      {mostrarProduto && (
        <CadastroProduto
          onClose={() => setMostrarProduto(false)}
          onSalvar={handleSalvarProduto}
        />
      )}
    </div>
  );
}