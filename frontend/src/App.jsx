import { BrowserRouter, Routes, Route } from "react-router-dom";
import CadastroFornecedor from "./components/CadastroFornecedor";
import ListaProdutos from "./pages/ListaProdutos";
import ListaFornecedores from "./pages/ListaFornecedores";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CadastroFornecedor />} />
        <Route path="/produtos" element={<ListaProdutos />} />
        <Route path="/fornecedores" element={<ListaFornecedores />} />
      </Routes>
    </BrowserRouter>
  );
}