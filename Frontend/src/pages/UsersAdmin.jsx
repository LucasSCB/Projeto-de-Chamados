import { useEffect, useState } from "react";
import { api } from "../api";

export default function UsersAdmin() {
  const [users, setUsers] = useState([]);
  const [nome, setNome] = useState("");
  const [setor, setSetor] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [role, setRole] = useState("USER");
  const [erro, setErro] = useState("");

  async function carregar() {
    try {
      const { data } = await api.get("/admin/users");
      setUsers(data);
    } catch (e) {
      setErro(e?.response?.data?.message || "Erro ao carregar usuários");
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function criar(e) {
    e.preventDefault();
    setErro("");

    try {
      // backend suporta apenas USER e ADMIN
      const roleOk = role === "ADMIN" ? "ADMIN" : "USER";
      await api.post("/admin/users", { nome, email, senha, role: roleOk, setor});
      setNome("");
      setEmail("");
      setSenha("");
      setRole("USER");
      setSetor("");
      carregar();
    } catch (e) {
      setErro(e?.response?.data?.message || "Erro ao criar usuário");
    }
  }

  async function deletar(id) {
    if (!confirm("Deseja realmente deletar este usuário?")) return;

    try {
      await api.delete(`/admin/users/${id}`);
      carregar();
    } catch (e) {
      setErro(e?.response?.data?.message || "Erro ao deletar usuário");
    }
  }

  return (
    <div className="container py-4">
      <h3>Gestão de Usuários</h3>

      {erro && <div className="alert alert-danger">{erro}</div>}

      <div className="card p-3 mb-4">
        <h5>Criar Usuário</h5>
        <form onSubmit={criar}>
          <div className="row g-2">
            <div className="col">
              <input
                className="form-control"
                placeholder="Nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>
            <div className="col">
              <input
                className="form-control"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                 className="form-control"
                 value={setor}
                 onChange={(e) => setSetor(e.target.value)}
                 placeholder="Setor (ex: Recepção)"
              />
            </div>
            <div className="col">
              <input
                type="password"
                className="form-control"
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
            </div>
            <div className="col">
              <select
                className="form-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>
            <div className="col-auto">
              <button className="btn btn-primary">Criar</button>
            </div>
          </div>
        </form>
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Setor</th>
            <th>Role</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.nome}</td>
              <td>{u.email}</td>
              <td>{u.setor}</td>
              <td>
                <span className="badge bg-secondary">{u.role}</span>
              </td>
              <td>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => deletar(u.id)}
                >
                  Deletar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
