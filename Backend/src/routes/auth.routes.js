// src/routes/auth.routes.js
const router = require("express").Router();
const { loginController } = require("../controllers/auth.controller");

router.get("/ping", (req, res) => res.json({ ok: true, route: "auth" }));
router.post("/login", loginController);

module.exports = router;
