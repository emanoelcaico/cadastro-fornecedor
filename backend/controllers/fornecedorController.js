const { Fornecedor } = require("../models");

exports.criar = async (req, res) => {
  const dados = req.body;

  const erros = {};
  if (!dados.nomeEmpresa?.trim()) erros.nomeEmpresa = "Obrigatório";
  if (!dados.cnpj?.trim()) erros.cnpj = "Obrigatório";

  if (Object.keys(erros).length > 0) {
    return res.status(400).json({ erros });
  }

  try {
    const fornecedor = await Fornecedor.create(dados);
    return res.status(201).json({
      mensagem: "Fornecedor cadastrado com sucesso!",
      fornecedor,
    });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
  return res.status(400).json({ erros: { cnpj: "Fornecedor com esse CNPJ já está cadastrado!" } });
}
    console.error(error);
    return res.status(500).json({ mensagem: "Erro ao cadastrar fornecedor" });
  }
};

exports.listar = async (req, res) => {
  try {
    const fornecedores = await Fornecedor.findAll({
      order: [["nomeEmpresa", "ASC"]],
    });
    res.json(fornecedores);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: "Erro ao listar fornecedores" });
  }
};

exports.buscarPorId = async (req, res) => {
  try {
    const fornecedor = await Fornecedor.findByPk(req.params.id);
    if (!fornecedor) {
      return res.status(404).json({ mensagem: "Fornecedor não encontrado" });
    }
    res.json(fornecedor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: "Erro ao buscar fornecedor" });
  }
};  


exports.excluir = async (req, res) => {
  const { id } = req.params;

  try {
    const fornecedor = await Fornecedor.findByPk(id);
    
    if (!fornecedor) {
      return res.status(404).json({ mensagem: "Fornecedor não encontrado" });
    }

    await fornecedor.destroy();

    return res.json({ mensagem: "Fornecedor excluído com sucesso!" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: "Erro ao excluir fornecedor" });
  }
};