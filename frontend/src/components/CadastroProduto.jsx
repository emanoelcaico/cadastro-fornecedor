import { useState } from 'react';
import './CadastroProduto.css';
import { criarProduto } from "../services/api"; // 


export default function CadastroProduto({ onClose, onSalvar }) {
  const [form, setForm] = useState({
    nome: '',
    codigoBarras: '',
    descricao: '',
    quantidade: '',
    categoria: '',
    categoriaOutro: '',
    dataValidade: '',
    imagem: null,
  });

  const [preview, setPreview] = useState(null);
  const [erros, setErros] = useState({});

  const categorias = [
    'Eletrônicos',
    'Alimentos',
    'Vestuário',
    'Higiene',
    'Limpeza',
    'Bebidas',
    'Outro',
  ];

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleImagem(e) {
    const file = e.target.files[0];
    if (!file) return;
    setForm((prev) => ({ ...prev, imagem: file }));
    setPreview(URL.createObjectURL(file));
  }

  function validar() {
    const novosErros = {};
    if (!form.nome.trim()) novosErros.nome = 'Informe o nome do produto';
    if (!form.descricao.trim()) novosErros.descricao = 'Informe a descrição';
    if (!form.categoria) novosErros.categoria = 'Selecione uma categoria';
    if (form.categoria === 'Outro' && !form.categoriaOutro.trim())
      novosErros.categoriaOutro = 'Especifique a categoria';
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  async function handleSubmit(e) {
  e.preventDefault();
  if (!validar()) return;

  try {
    // 🔑 SALVA NO BANCO
    const { data } = await criarProduto({
      nome: form.nome,
      codigoBarras: form.codigoBarras,
      descricao: form.descricao,
      quantidade: form.quantidade,
      categoria: form.categoria === "Outro" ? form.categoriaOutro : form.categoria,
      categoriaOutro: form.categoria === "Outro" ? form.categoriaOutro : null,
      dataValidade: form.dataValidade || null,
      imagem: form.imagem?.name || null,
    });

    console.log("✅ Produto salvo no banco:", data);

    // Passa o produto salvo para o pai (que adiciona na lista visual)
    onSalvar?.(data.produto);
  } catch (err) {
    console.error("❌ Erro ao salvar produto:", err);
    alert(err.response?.data?.mensagem || "Erro ao cadastrar produto");
  }
}

  return (
    <div className="produto-modal">
      <div className="produto-container">
        {/* Cabeçalho */}
        <header className="produto-header">
          <h2>Cadastro de Produto</h2>
          <button
            type="button"
            className="btn-fechar"
            onClick={onClose}
            aria-label="Fechar"
          >
            ✕
          </button>
        </header>

        {/* Formulário */}
        <form className="produto-form" onSubmit={handleSubmit}>
          <div className="campo">
            <label htmlFor="nome">Nome do Produto *</label>
            <input
              id="nome"
              name="nome"
              type="text"
              placeholder="Insira o nome do produto"
              value={form.nome}
              onChange={handleChange}
            />
            {erros.nome && <span className="erro">{erros.nome}</span>}
          </div>

          <div className="campo">
            <label htmlFor="codigoBarras">Código de Barras</label>
            <input
              id="codigoBarras"
              name="codigoBarras"
              type="text"
              inputMode="numeric"
              placeholder="Insira o código de barras"
              value={form.codigoBarras}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  codigoBarras: e.target.value.replace(/\D/g, ''),
                }))
              }
            />
          </div>

          <div className="campo">
            <label htmlFor="descricao">Descrição *</label>
            <textarea
              id="descricao"
              name="descricao"
              rows={3}
              placeholder="Descreva brevemente o produto"
              value={form.descricao}
              onChange={handleChange}
            />
            {erros.descricao && <span className="erro">{erros.descricao}</span>}
          </div>

          <div className="linha">
            <div className="campo">
              <label htmlFor="quantidade">Quantidade em Estoque</label>
              <input
                id="quantidade"
                name="quantidade"
                type="text"
                inputMode="numeric"
                placeholder="Quantidade disponível"
                value={form.quantidade}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    quantidade: e.target.value.replace(/\D/g, ''),
                  }))
                }
              />
            </div>

            <div className="campo">
              <label htmlFor="dataValidade">Data de Validade</label>
              <input
                id="dataValidade"
                name="dataValidade"
                type="date"
                value={form.dataValidade}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="campo">
            <label htmlFor="categoria">Categoria *</label>
            <select
              id="categoria"
              name="categoria"
              value={form.categoria}
              onChange={handleChange}
            >
              <option value="">Selecione uma categoria</option>
              {categorias.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {erros.categoria && <span className="erro">{erros.categoria}</span>}
          </div>

          {form.categoria === 'Outro' && (
            <div className="campo">
              <label htmlFor="categoriaOutro">Especifique a categoria *</label>
              <input
                id="categoriaOutro"
                name="categoriaOutro"
                type="text"
                placeholder="Digite a categoria"
                value={form.categoriaOutro}
                onChange={handleChange}
              />
              {erros.categoriaOutro && (
                <span className="erro">{erros.categoriaOutro}</span>
              )}
            </div>
          )}

          <div className="campo">
            <label htmlFor="imagem">Imagem do Produto</label>
            <input
              id="imagem"
              name="imagem"
              type="file"
              accept="image/*"
              onChange={handleImagem}
            />
            {preview && (
              <img
                src={preview}
                alt="Pré-visualização"
                className="preview-img"
              />
            )}
          </div>

          <footer className="produto-acoes">
            <button type="button" className="btn-cancelar" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-salvar">
              Salvar Produto
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}