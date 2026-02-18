// src/app.js
const express = require("express");
const cors = require("cors");

const errorHandler = require("./middlewares/errorHandler");

// Rotas
const authRoutes = require("./routes/auth.routes");
const chamadosRoutes = require("./routes/chamados.routes");
const adminRoutes = require("./routes/admin.routes");
const usersRoutes = require("./routes/users.routes");

const app = express();

app.use(cors());
app.use(express.json({ limit: "2mb" }));

// Healthcheck
app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/auth", authRoutes);
app.use("/chamados", chamadosRoutes);
app.use("/admin", adminRoutes);
app.use("/users", usersRoutes);

// 404 padrão
app.use((req, res) => res.status(404).json({ error: "Rota não encontrada" }));

// handler de erro por último
app.use(errorHandler);

module.exports = app;
