const express = require("express");
const cors = require("cors");
const fornecedoresRoutes = require("./routes/fornecedores");
const produtosRoutes = require("./routes/produtos");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/fornecedores", fornecedoresRoutes);
app.use("/api/produtos", produtosRoutes);

app.listen(3001, () => {
  console.log("🚀 Backend rodando em http://localhost:3001");
});