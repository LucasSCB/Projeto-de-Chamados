// src/routes/users.routes.js
const router = require("express").Router();
const { auth } = require("../middlewares/auth");

router.get("/me", auth, (req, res) => res.json({ user: req.user }));

module.exports = router;
