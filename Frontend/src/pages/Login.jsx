import { useState } from "react";
import { api } from "../api";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("admin@local.com");
  const [senha, setSenha] = useState("admin123");
  const [erro, setErro] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");

    try {
      const { data } = await api.post("/auth/login", { email, senha });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      onLogin(data.user);
    } catch (e) {
      setErro(e?.response?.data?.message || "Falha no login");
    }
  }

  return (
    <div className="container py-5" style={{ maxWidth: 420 }}>
      <h3 className="mb-3">Login</h3>

      {erro && <div className="alert alert-danger">{erro}</div>}

      <form onSubmit={handleSubmit} className="card p-3">
        <label className="form-label">Email</label>
        <input className="form-control mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="form-label">Senha</label>
        <input className="form-control mb-3"
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />

        <button className="btn btn-primary w-100">Entrar</button>
      </form>
    </div>
  );
}
