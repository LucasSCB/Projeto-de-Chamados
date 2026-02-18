// src/services/admin.service.js
const { prisma } = require("../utils/prisma");

async function stats() {
  // Observação: em algumas versões do Prisma, _count._all não existe.
  // Para ficar compatível, contamos pelo campo id.
  const [totalChamados, porStatusRaw, topUsersRaw] = await Promise.all([
    prisma.chamado.count(),
    prisma.chamado.groupBy({
      by: ["status"],
      _count: { id: true },
    }),
    prisma.chamado.groupBy({
      by: ["userId"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 5,
    }),
  ]);

  const porStatus = porStatusRaw
    .map((r) => ({ status: r.status, total: r._count.id }))
    .sort((a, b) => a.status.localeCompare(b.status));

  const getCount = (st) => porStatus.find((x) => x.status === st)?.total || 0;

  const ids = topUsersRaw.map((r) => r.userId).filter((v) => v !== null);
  const users = ids.length
    ? await prisma.user.findMany({
        where: { id: { in: ids } },
        select: { id: true, nome: true, email: true, role: true, setor: true },
      })
    : [];

  const byId = new Map(users.map((u) => [u.id, u]));

  const topUsers = topUsersRaw
    .filter((r) => r.userId !== null)
    .map((r) => ({
      user: byId.get(r.userId) || { id: r.userId, nome: "(desconhecido)" },
      total: r._count.id,
    }));

  return {
    totalChamados,
    abertos: getCount("ABERTO"),
    emAndamento: getCount("EM_ANDAMENTO"),
    fechados: getCount("FECHADO"),
    porStatus,
    topUsers,
  };
}

module.exports = { stats };
