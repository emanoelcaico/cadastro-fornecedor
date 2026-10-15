import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

// ---------- Fornecedores ----------
export const cadastrarFornecedor = (dados) => api.post("/fornecedores", dados);
export const listarFornecedores = () => api.get("/fornecedores");
export const buscarFornecedor = (id) => api.get(`/fornecedores/${id}`);

// ---------- Produtos ----------
export const criarProduto = (dados) => api.post("/produtos", dados);
export const listarProdutos = () => api.get("/produtos");
export const buscarProduto = (id) => api.get(`/produtos/${id}`);


// ---------- Associação Produto <-> Fornecedor ----------
export const associarFornecedor = (produtoId, fornecedorId) =>
  api.post(`/produtos/${produtoId}/fornecedores`, { fornecedorId });

export const desassociarFornecedor = (produtoId, fornecedorId) =>
  api.delete(`/produtos/${produtoId}/fornecedores/${fornecedorId}`);



