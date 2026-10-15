const { Produto, Fornecedor } = require("../models");

exports.criar = async (req, res) => {
  const dados = req.body;

  const erros = {};
  if (!dados.nome?.trim()) erros.nome = "Obrigatório";
  if (!dados.descricao?.trim()) erros.descricao = "Obrigatório";
  if (!dados.categoria?.trim()) erros.categoria = "Obrigatório";

  if (Object.keys(erros).length > 0) {
    return res.status(400).json({ erros });
  }

  try {
    const produto = await Produto.create({
      nome: dados.nome,
      codigoBarras: dados.codigoBarras || null,
      descricao: dados.descricao,
      quantidade: dados.quantidade ? Number(dados.quantidade) : 0,
      categoria: dados.categoria,
      categoriaOutro: dados.categoriaOutro || null,
      dataValidade: dados.dataValidade || null,
      imagem: dados.imagem || null,
    });

    return res.status(201).json({
      mensagem: "Produto cadastrado com sucesso!",
      produto,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensagem: "Erro ao cadastrar produto" });
  }
};

exports.listar = async (req, res) => {
  try {
    const produtos = await Produto.findAll({ order: [["nome", "ASC"]] });
    res.json(produtos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: "Erro ao listar produtos" });
  }
};  

exports.buscarPorId = async (req, res) => {
  try {
    const produto = await Produto.findByPk(req.params.id, {
      include: [{ model: Fornecedor, as: "fornecedores" }],
    });
    if (!produto) {
      return res.status(404).json({ mensagem: "Produto não encontrado" });
    }
    res.json(produto);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: "Erro ao buscar produto" });
  }
};

exports.associarFornecedor = async (req, res) => {
  const { id } = req.params;
  const { fornecedorId } = req.body;

  console.log("🔵 Iniciando associação:", { produtoId: id, fornecedorId });

  try {
    const produto = await Produto.findByPk(id);
    console.log("🟢 Produto encontrado?", !!produto);

    const fornecedor = await Fornecedor.findByPk(fornecedorId);
    console.log("🟢 Fornecedor encontrado?", !!fornecedor);

    if (!produto || !fornecedor) {
      return res
        .status(404)
        .json({ mensagem: "Produto ou fornecedor não encontrado" });
    }

    const produtoCompleto = await Produto.findByPk(id, {
      include: [{ model: Fornecedor, as: "fornecedores" }],
    });

    const jaAssociado = produtoCompleto.fornecedores.some(
      (f) => f.id === fornecedor.id
    );

    if (jaAssociado) {
      return res.status(400).json({
        mensagem: "Fornecedor já está associado a este produto!",
      });
    }

    console.log("🟣 Chamando addFornecedores...");
    await produto.addFornecedores(fornecedor);
    console.log("✅ Associação criada com sucesso");

    return res.json({
      mensagem: "Fornecedor associado com sucesso ao produto!",
    });
  } catch (err) {
    console.error("❌❌❌ ERRO NO ASSOCIAR ❌❌❌");
    console.error("Nome:", err.name);
    console.error("Mensagem:", err.message);
    console.error("SQL:", err.sql);
    console.error("Original:", err.original?.message);
    res.status(500).json({ mensagem: "Erro ao associar fornecedor" });
  }
};

exports.desassociarFornecedor = async (req, res) => {
  const { id, fornecedorId } = req.params;

  try {
    const produto = await Produto.findByPk(id);
    const fornecedor = await Fornecedor.findByPk(fornecedorId);

    if (!produto || !fornecedor) {
      return res
        .status(404)
        .json({ mensagem: "Produto ou fornecedor não encontrado" });
    }

    await produto.removeFornecedores(fornecedor);

    return res.json({
      mensagem: "Fornecedor desassociado com sucesso!",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: "Erro ao desassociar fornecedor" });
  }
};




