// src/routes/chamados.routes.js
const router = require("express").Router();
const { auth } = require("../middlewares/auth");
const { validateBody } = require("../middlewares/validate");
const chamadosController = require("../controllers/chamados.controller");

router.get("/ping", auth, (req, res) => {
  res.json({ ok: true, route: "chamados", user: req.user });
});

router.get("/", auth, chamadosController.list);
router.get("/:id", auth, chamadosController.getById);
router.post("/", auth, validateBody(["titulo", "descricao"]), chamadosController.create);
router.patch("/:id/status", auth, validateBody(["status"]), chamadosController.setStatus);
router.delete("/:id", auth, chamadosController.remove);

module.exports = router;
