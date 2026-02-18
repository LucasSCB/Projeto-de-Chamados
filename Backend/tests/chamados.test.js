const request = require("supertest");
const app = require("../src/app");

async function loginAdmin() {
  const res = await request(app)
    .post("/auth/login")
    .send({ email: "admin@local.com", senha: "admin123" });

  return res.body.token;
}

describe("Chamados", () => {
  test("GET /chamados -> 401 sem token", async () => {
    const res = await request(app).get("/chamados");
    expect(res.statusCode).toBe(401);
  });

  test("POST /chamados -> cria chamado e retorna status ABERTO", async () => {
    const token = await loginAdmin();

    const res = await request(app)
      .post("/chamados")
      .set("Authorization", `Bearer ${token}`)
      .send({ titulo: "Chamado teste", descricao: "Criado pelo teste automatizado" });

    expect([200, 201]).toContain(res.statusCode);
    expect(res.body.data).toBeTruthy();
    expect(res.body.data.status).toBe("ABERTO");
  });

  test("PATCH /chamados/:id/status -> 400 com status inválido", async () => {
    const token = await loginAdmin();

    // cria um chamado para ter um ID válido
    const created = await request(app)
      .post("/chamados")
      .set("Authorization", `Bearer ${token}`)
      .send({ titulo: "Teste status", descricao: "Mudança de status" });

    const id = created.body.data.id;

    const res = await request(app)
      .patch(`/chamados/${id}/status`)
      .set("Authorization", `Bearer ${token}`)
      .send({ status: "BANANA" });

    expect(res.statusCode).toBe(400);
  });
});
