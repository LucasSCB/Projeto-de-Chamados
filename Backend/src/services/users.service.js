// src/services/users.service.js
const bcrypt = require("bcryptjs");
const { prisma } = require("../utils/prisma");

async function listUsers() {
  return prisma.user.findMany({
    orderBy: { id: "desc" },
    select: {
      id: true,
      nome: true,
      email: true,
      role: true,
      setor: true,
      criadoEm: true,
    },
  });
}

async function createUser({ nome, email, senha, role, setor }) {
  const emailNorm = String(email || "").toLowerCase().trim();
  const nomeTrim = String(nome || "").trim();
  const senhaStr = String(senha || "");
  const setorTrim = String(setor || "").trim();

  if (!nomeTrim || !emailNorm || !senhaStr) {
    const e = new Error("nome, email e senha são obrigatórios");
    e.status = 400;
    e.code = "VALIDATION_ERROR";
    throw e;
  }

  const existe = await prisma.user.findUnique({ where: { email: emailNorm } });
  if (existe) {
    const e = new Error("Email já cadastrado");
    e.status = 409;
    e.code = "EMAIL_IN_USE";
    throw e;
  }

  const senhaHash = await bcrypt.hash(senhaStr, 10);

  return prisma.user.create({
    data: {
      nome: nomeTrim,
      email: emailNorm,
      senhaHash,
      role: role === "ADMIN" ? "ADMIN" : "USER",
      // opcional
      setor: setorTrim ? setorTrim : null,
    },
    select: {
      id: true,
      nome: true,
      email: true,
      role: true,
      setor: true,
      criadoEm: true,
    },
  });
}

async function deleteUser({ id, actor }) {
  const userId = Number(id);
  if (!Number.isInteger(userId) || userId <= 0) {
    const e = new Error("ID inválido");
    e.status = 400;
    e.code = "VALIDATION_ERROR";
    throw e;
  }

  if (actor?.id === userId) {
    const e = new Error("Você não pode remover seu próprio usuário");
    e.status = 400;
    e.code = "CANNOT_DELETE_SELF";
    throw e;
  }

  const exists = await prisma.user.findUnique({ where: { id: userId } });
  if (!exists) {
    const e = new Error("Usuário não encontrado");
    e.status = 404;
    e.code = "NOT_FOUND";
    throw e;
  }

  // regra simples: se apagar usuário, mantém chamados (userId vira null)
  await prisma.chamado.updateMany({ where: { userId }, data: { userId: null } });
  await prisma.user.delete({ where: { id: userId } });
  return { ok: true };
}

module.exports = { listUsers, createUser, deleteUser };
