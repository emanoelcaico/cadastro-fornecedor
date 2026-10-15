const { cnpjValido, emailValido } = require("../utils/validacoes");

// "Banco de dados" em memória
const fornecedores = [];

function validarDados(dados) {
  const erros = {};

  if (!dados.nomeEmpresa?.trim()) erros.nomeEmpresa = "Informe o nome da empresa.";
  if (!dados.cnpj?.trim()) erros.cnpj = "Informe o CNPJ.";
  else if (!cnpjValido(dados.cnpj)) erros.cnpj = "CNPJ inválido.";
  if (!dados.endereco?.trim()) erros.endereco = "Informe o endereço.";
  if (!dados.telefone?.trim()) erros.telefone = "Informe o telefone.";
  if (!dados.email?.trim()) erros.email = "Informe o e-mail.";
  else if (!emailValido(dados.email)) erros.email = "E-mail inválido.";
  if (!dados.contatoPrincipal?.trim()) erros.contatoPrincipal = "Informe o contato principal.";

  return erros;
}

function cadastrarFornecedor(dados) {
  const erros = validarDados(dados);
  if (Object.keys(erros).length > 0) {
    return { status: 400, body: { erros } };
  }

  const jaExiste = fornecedores.some(f => f.cnpj === dados.cnpj);
  if (jaExiste) {
    return {
      status: 409,
      body: { erros: { cnpj: "Fornecedor com esse CNPJ já está cadastrado!" } }
    };
  }

  const novo = { id: fornecedores.length + 1, ...dados };
  fornecedores.push(novo);

  return {
    status: 201,
    body: {
      mensagem: "Fornecedor cadastrado com sucesso!",
      fornecedor: novo
    }
  };
}

function listarFornecedores() {
  return fornecedores;
}

module.exports = { cadastrarFornecedor, listarFornecedores };