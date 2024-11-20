import { Router } from "express";
import LivroController from "../Controller/LivroController";
const router = Router();

router.post("/livros", LivroController.create);
router.put("/livros/:id", LivroController.update);
router.get("/livros", LivroController.find);
router.get("/livros/ativos", LivroController.getAllActive); // Nova rota para buscar livros ativos
router.patch("/livros/:id", LivroController.delete);
router.get("/livros/filtrar", LivroController.findOne); // Nova rota para buscar livros com filtros

// Novos endpoints para compra e aluguel de livros
router.put("/api/comprar/:id", LivroController.comprar);
router.put("/api/alugar/:id", LivroController.alugar);

export default router;
