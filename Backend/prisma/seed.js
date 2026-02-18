const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const email = "admin@local.com";
  const senha = "admin123";

  const existe = await prisma.user.findUnique({ where: { email } });
  if (existe) {
    console.log("Admin já existe:", email);
    return;
  }

  const senhaHash = await bcrypt.hash(senha, 10);

  const admin = await prisma.user.create({
    data: {
      nome: "Admin",
      email,
      senhaHash,
      role: "ADMIN",
      setor: "TI",
    },
    select: { id: true, nome: true, email: true, role: true },
  });

  console.log("Admin criado:", admin);
  console.log("Login:", email, "Senha:", senha);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
