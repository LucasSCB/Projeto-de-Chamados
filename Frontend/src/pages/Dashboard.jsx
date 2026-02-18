import { useEffect, useState } from "react";
import { api } from "../api";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(true);

  async function carregar() {
    setErro("");
    setLoading(true);
    try {
      const resp = await api.get("/admin/stats");
      setData(resp.data);
    } catch (e) {
      setErro(e?.response?.data?.message || "Erro ao carregar dashboard");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  if (loading) {
    return (
      <div className="container py-4">
        <div className="alert alert-secondary">Carregando dashboard...</div>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="container py-4">
        <div className="alert alert-danger">{erro}</div>
        <button className="btn btn-outline-secondary" onClick={carregar}>
          Tentar novamente
        </button>
      </div>
    );
  }

  const labels = data.porStatus.map((x) => x.status);
  const values = data.porStatus.map((x) => x.total);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Chamados",
        data: values,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: { legend: { display: true } },
  };

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h3 className="m-0">Dashboard (Admin)</h3>
        <button className="btn btn-outline-secondary" onClick={carregar}>
          Recarregar
        </button>
      </div>

      {/* Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card p-3">
            <div className="text-muted">Total</div>
            <div className="fs-3 fw-bold">{data.totalChamados}</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-3">
            <div className="text-muted">Abertos</div>
            <div className="fs-3 fw-bold">{data.abertos}</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-3">
            <div className="text-muted">Fechados</div>
            <div className="fs-3 fw-bold">{data.fechados}</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-3">
            <div className="text-muted">Em andamento</div>
            <div className="fs-3 fw-bold">{data.emAndamento}</div>
          </div>
        </div>
      </div>

      {/* Gráfico */}
      <div className="card p-3 mb-4">
        <h5 className="mb-3">Chamados por status</h5>
        <Bar data={chartData} options={options} />
      </div>

      {/* Top usuários */}
      <div className="card p-3">
        <h5 className="mb-3">Top usuários (mais chamados)</h5>
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th>Usuário</th>
                <th>Email</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {(data.topUsers || []).map((u) => (
                <tr key={u.user?.id}>
                  <td>{u.user?.nome}</td>
                  <td className="text-muted">{u.user?.email}</td>
                  <td className="fw-bold">{u.total}</td>
                </tr>
              ))}
              {(data.topUsers || []).length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center text-muted py-4">
                    Sem dados ainda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
