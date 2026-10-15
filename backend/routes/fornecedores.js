const express = require("express");
const router = express.Router();

// Se estiver salvando em memória:
let fornecedores = []; // ou importe de onde já salva

// GET /api/fornecedores — lista todos
router.get("/", (req, res) => {
  try {
    return res.status(200).json(fornecedores);
  } catch (err) {
    console.error("Erro ao listar fornecedores:", err);
    return res.status(500).json({ mensagem: "Erro ao buscar fornecedores." });
  }
});

// GET /api/fornecedores/:id — busca um específico
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const fornecedor = fornecedores.find((f) => String(f.id) === id);

  if (!fornecedor) {
    return res.status(404).json({ mensagem: "Fornecedor não encontrado." });
  }

  return res.status(200).json(fornecedor);
});

// POST /api/fornecedores — cadastro (o que você já deve ter)
router.post("/", (req, res) => {
  const novo = { id: Date.now(), ...req.body };
  fornecedores.push(novo);
  return res.status(201).json({
    mensagem: "Fornecedor cadastrado com sucesso!",
    fornecedor: novo
  });
});

module.exports = router;