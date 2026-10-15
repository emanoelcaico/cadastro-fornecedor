const express = require("express");
const router = express.Router();
const controller = require("../controllers/produtoController");

router.get("/", controller.listar);
router.get("/:id", controller.buscarPorId);
router.post("/", controller.criar);
router.post("/:id/fornecedores", controller.associarFornecedor);
router.delete("/:id/fornecedores/:fornecedorId", controller.desassociarFornecedor);

 

module.exports = router;