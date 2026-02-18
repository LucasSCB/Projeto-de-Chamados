// src/middlewares/auth.js
const jwt = require("jsonwebtoken");
const { env } = require("../utils/env");
const { prisma } = require("../utils/prisma");

async function auth(req, res, next) {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({
      error: { code: "TOKEN_MISSING", message: "Token ausente" },
    });
  }

  const [type, token] = header.split(" ");

  if (String(type).toLowerCase() !== "bearer" || !token) {
    return res.status(401).json({
      error: { code: "TOKEN_INVALID", message: "Formato inválido (Bearer token)" },
    });
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, nome: true, email: true, role: true, setor: true },
    });

    if (!user) {
      return res.status(401).json({
        error: { code: "USER_NOT_FOUND", message: "Usuário não existe" },
      });
    }

    req.user = user;
    return next();
  } catch (e) {
    return res.status(401).json({
      error: { code: "TOKEN_INVALID", message: "Token inválido" },
    });
  }
}

module.exports = { auth };
