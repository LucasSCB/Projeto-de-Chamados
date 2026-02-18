// src/services/chamados.service.js
const { prisma } = require("../utils/prisma");
const { assertValidStatus } = require("../utils/chamadoStatus");

async function listChamados({ user, page = 1, limit = 10, q, status }) {
  const pageNum = Math.max(Number(page) || 1, 1);
  const take = Math.min(Math.max(Number(limit) || 10, 1), 100);
  const skip = (pageNum - 1) * take;

  // ADMIN vê todos; USER só os seus
  const whereBase = user.role === "ADMIN" ? {} : { userId: user.id };

  // valida status se veio
  let statusFilter;
  if (status) statusFilter = assertValidStatus(status);

  const queryText = String(q || "").trim();

  // busca simples em titulo/descricao (SQLite compatível)
  const where = {
    ...whereBase,
    ...(statusFilter ? { status: statusFilter } : {}),
    ...(queryText
      ? {
          OR: [
            { titulo: { contains: queryText } },
            { descricao: { contains: queryText } },
          ],
        }
      : {}),
  };

  const [total, data] = await Promise.all([
    prisma.chamado.count({ where }),
    prisma.chamado.findMany({
      where,
      orderBy: { criadoEm: "desc" },
      skip,
      take,
      include: {
        user: { select: { id: true, nome: true, email: true, role: true, setor: true } },
      },
    }),
  ]);

  const pages = Math.max(Math.ceil(total / take), 1);

  return {
    data,
    meta: { page: pageNum, limit: take, total, pages },
  };
}

async function getChamadoById({ id, user }) {
  const idNum = Number(id);
  if (!Number.isInteger(idNum) || idNum <= 0) {
    const e = new Error("ID inválido");
    e.status = 400;
    e.code = "INVALID_ID";
    throw e;
  }

  const chamado = await prisma.chamado.findUnique({
    where: { id: idNum },
    include: {
      user: { select: { id: true, nome: true, email: true, role: true, setor: true } },
    },
  });

  if (!chamado) {
    const e = new Error("Chamado não encontrado");
    e.status = 404;
    e.code = "NOT_FOUND";
    throw e;
  }

  if (user.role !== "ADMIN" && chamado.userId !== user.id) {
    const e = new Error("Sem permissão para acessar este chamado");
    e.status = 403;
    e.code = "FORBIDDEN";
    throw e;
  }

  return chamado;
}

async function createChamado({ titulo, descricao, user }) {
  const t = String(titulo || "").trim();
  const d = String(descricao || "").trim();

  if (!t || t.length < 3) {
    const e = new Error("Título é obrigatório (mínimo 3 caracteres)");
    e.status = 400;
    e.code = "VALIDATION_ERROR";
    throw e;
  }

  if (!d || d.length < 5) {
    const e = new Error("Descrição é obrigatória (mínimo 5 caracteres)");
    e.status = 400;
    e.code = "VALIDATION_ERROR";
    throw e;
  }

  return prisma.chamado.create({
    data: {
      titulo: t,
      descricao: d,
      userId: user.id,
      status: "ABERTO",
    },
    include: {
      user: { select: { id: true, nome: true, email: true, role: true, setor: true } },
    },
  });
}

async function updateStatus({ id, status, user }) {
  const chamado = await getChamadoById({ id, user });
  const statusOk = assertValidStatus(status);

  return prisma.chamado.update({
    where: { id: chamado.id },
    data: { status: statusOk },
    include: {
      user: { select: { id: true, nome: true, email: true, role: true, setor: true } },
    },
  });
}

async function removeChamado({ id, user }) {
  const chamado = await getChamadoById({ id, user });

  if (user.role !== "ADMIN") {
    const e = new Error("Apenas ADMIN pode remover chamado");
    e.status = 403;
    e.code = "FORBIDDEN";
    throw e;
  }

  await prisma.chamado.delete({ where: { id: chamado.id } });
  return { ok: true };
}

module.exports = {
  listChamados,
  getChamadoById,
  createChamado,
  updateStatus,
  removeChamado,
};
