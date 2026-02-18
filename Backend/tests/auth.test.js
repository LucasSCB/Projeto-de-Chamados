const request = require("supertest");
const app = require("../src/app");

describe("Auth", () => {
  test("POST /auth/login -> retorna token quando credenciais são válidas", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "admin@local.com", senha: "admin123" });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeTruthy();
    expect(res.body.user).toBeTruthy();
    expect(res.body.user.email).toBe("admin@local.com");
  });

  test("POST /auth/login -> 401 quando credenciais são inválidas", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "admin@local.com", senha: "senha_errada" });

    expect(res.statusCode).toBe(401);
  });
});
