# Cadastro Fornecedor — Notas

## Como rodar

### Backend (porta 3001)
cd backend
npm run dev

### Frontend (porta 5173)
cd frontend
npm run dev

## URLs
- Backend (raiz):  http://localhost:3001
- Produtos:        http://localhost:3001/api/produtos
- Fornecedores:    http://localhost:3001/api/fornecedores
- Frontend:        http://localhost:5173

## Rotas da API
- GET/POST  /api/fornecedores
- GET       /api/fornecedores/:id
- GET/POST  /api/produtos
- GET       /api/produtos/:id
- POST      /api/produtos/:id/fornecedores
- DELETE    /api/produtos/:id/fornecedores/:fornecedorId

## services/api.js exporta
- cadastrarFornecedor, listarFornecedores, buscarFornecedor
- criarProduto, listarProdutos, buscarProduto
- associarFornecedor, desassociarFornecedor

## Problemas comuns
- EADDRINUSE :::3001  -> porta ocupada
    netstat -ano | findstr :3001
    taskkill /PID <numero> /F
- "does not provide an export named X" -> falta exportar X no api.js
- Vite em outra porta -> olhar terminal (pode ser 5174)
- "Failed to resolve import" -> arquivo nao existe ou nome errado
- "Identifier has already been declared" -> arquivo importando a si mesmo

## Pendencias
- [ ] Upload real de imagem (hoje so envia o nome)
- [ ] Tela de lista de produtos puxando do banco
- [ ] Editar/excluir produto
- [ ] Testar associacao fornecedor <-> produto pela tela
- [ ] Cadastrar fornecedores de teste

## Ultimo commit
99c6b4c - Estado funcional: backend + frontend + cadastro de produtos
