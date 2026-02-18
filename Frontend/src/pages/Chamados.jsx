import { useEffect, useState } from "react";
import { api } from "../api";

export default function Chamados({ user, onLogout }) {
  const [lista, setLista] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [erro, setErro] = useState("");
  const [filtro, setFiltro] = useState("");

  const isAdmin = user?.role === "ADMIN";

  async function carregar() {
    setErro("");
    try {
      const { data } = await api.get("/chamados", {
        params: filtro ? { status: filtro } : {},
      });
      // backend retorna { data, meta }
      setLista(data?.data || []);
    } catch (e) {
      setErro(e?.response?.data?.message || "Erro ao listar chamados");
    }
  }

  useEffect(() => {
    carregar();
  }, [filtro]);

  async function criar(e) {
    e.preventDefault();
    setErro("");
    try {
      await api.post("/chamados", { titulo, descricao });
      setTitulo("");
      setDescricao("");
      await carregar();
    } catch (e) {
      setErro(e?.response?.data?.message || "Erro ao criar chamado");
    }
  }

  async function atualizarStatus(id, status) {
    setErro("");
    try {
      await api.patch(`/chamados/${id}/status`, { status });
      await carregar();
    } catch (e) {
      setErro(e?.response?.data?.message || "Erro ao atualizar status");
    }
  }

  async function deletar(id) {
    if (!confirm("Deletar este chamado?")) return;
    setErro("");
    try {
      await api.delete(`/chamados/${id}`);
      await carregar();
    } catch (e) {
      setErro(e?.response?.data?.message || "Erro ao deletar");
    }
  }

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <h3 className="m-0">Chamados</h3>
          <small className="text-muted">
            Logado como: {user?.nome} ({user?.role})
          </small>
        </div>
        <button className="btn btn-outline-danger" onClick={onLogout}>
          Sair
        </button>
      </div>

      {erro && <div className="alert alert-danger">{erro}</div>}

      <div className="card p-3 mb-3">
        <h5>Criar chamado</h5>
        <form onSubmit={criar}>
          <input
            className="form-control mb-2"
            placeholder="Título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
          <textarea
            className="form-control mb-2"
            placeholder="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
          <button className="btn btn-primary">Criar</button>
        </form>
      </div>

      <div className="d-flex gap-2 align-items-center mb-2">
        <span className="text-muted">Filtro:</span>
        <select
          className="form-select"
          style={{ maxWidth: 200 }}
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        >
          <option value="">Todos</option>
          <option value="ABERTO">ABERTO</option>
          <option value="EM_ANDAMENTO">EM_ANDAMENTO</option>
          <option value="FECHADO">FECHADO</option>
        </select>

        <button className="btn btn-outline-secondary" onClick={carregar}>
          Recarregar
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Descrição</th>
              <th>Status</th>
              {isAdmin && <th style={{ width: 220 }}>Ações</th>}
            </tr>
          </thead>
          <tbody>
            {lista.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.titulo}</td>
                <td>{c.descricao}</td>
                <td>
                  <span
                    className={`badge ${
                      c.status === "ABERTO"
                        ? "text-bg-warning"
                        : c.status === "EM_ANDAMENTO"
                        ? "text-bg-info"
                        : "text-bg-success"
                    }`}
                  >
                    {c.status}
                  </span>
                </td>

                {isAdmin && (
                  <td className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => atualizarStatus(c.id, "EM_ANDAMENTO")}
                    >
                      Andamento
                    </button>
                    <button
                      className="btn btn-sm btn-outline-success"
                      onClick={() => atualizarStatus(c.id, "FECHADO")}
                    >
                      Fechar
                    </button>
                    <button
                      className="btn btn-sm btn-outline-warning"
                      onClick={() => atualizarStatus(c.id, "ABERTO")}
                    >
                      Reabrir
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => deletar(c.id)}
                    >
                      Deletar
                    </button>
                  </td>
                )}
              </tr>
            ))}

            {lista.length === 0 && (
              <tr>
                <td
                  colSpan={isAdmin ? 5 : 4}
                  className="text-center text-muted py-4"
                >
                  Nenhum chamado encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {!isAdmin && (
        <div className="alert alert-info mt-3">
          <strong>Dica:</strong> Usuários <b>USER</b> podem abrir e acompanhar seus
          chamados. Alterações de status são feitas pela equipe (ADMIN).
        </div>
      )}
    </div>
  );
}
