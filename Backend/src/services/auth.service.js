const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { prisma } = require("../utils/prisma");
const { env } = require("../utils/env");

async function login({ email, senha }) {
  const emailNorm = String(email || "").toLowerCase().trim();
  const senhaStr = String(senha || "");

  if (!emailNorm || !senhaStr) {
    const e = new Error("Email e senha são obrigatórios");
    e.status = 400;
    throw e;
  }

  const user = await prisma.user.findUnique({
    where: { email: emailNorm },
  });

  if (!user) {
    const e = new Error("Credenciais inválidas");
    e.status = 401;
    throw e;
  }

  const ok = await bcrypt.compare(senhaStr, user.senhaHash);
  if (!ok) {
    const e = new Error("Credenciais inválidas");
    e.status = 401;
    throw e;
  }

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    env.JWT_SECRET,
    { expiresIn: "8h" }
  );

  return {
    token,
    user: { id: user.id, nome: user.nome, email: user.email, role: user.role, setor: user.setor },
  };
}

module.exports = { login };
