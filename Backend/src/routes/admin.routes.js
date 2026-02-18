// src/routes/admin.routes.js
const router = require("express").Router();
const { auth } = require("../middlewares/auth");
const { requireRole } = require("../middlewares/requireRole");
const { validateBody } = require("../middlewares/validate");
const adminController = require("../controllers/admin.controller");

// health
router.get("/ping", (req, res) => res.json({ ok: true, route: "admin" }));

// tudo abaixo precisa estar logado e ser ADMIN
router.use(auth);
router.use(requireRole("ADMIN"));

// dashboard
router.get("/stats", adminController.stats);

// gestão de usuários (ADMIN)
router.get("/users", adminController.listUsers);
router.post("/users", validateBody(["nome", "email", "senha", "role"]), adminController.createUser);
router.delete("/users/:id", adminController.deleteUser);

module.exports = router;
