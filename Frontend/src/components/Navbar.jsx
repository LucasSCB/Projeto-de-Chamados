export default function Navbar({user, page, setPage, onLogout}) {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark px3">
            <span className="navbar-brand fw-bold px-3">Sistema de Chamados</span>
        
      <div className="navbar-nav me-auto">
        <button
          className={`nav-link btn btn-link text-white ${page === "chamados" ? "fw-bold" : ""}`}
          onClick={() => setPage("chamados")}
        >
          Chamados
        </button>


                {user?.role === "ADMIN" && (
        <button
            className={`nav-link btn btn-link text-white ${page === "dashboard" ? "fw-bold" : ""}`}
            onClick={() => setPage("dashboard")}
        >
            Dashboard
        </button>
        )}

        {user?.role === "ADMIN" && (
          <button
            className={`nav-link btn btn-link text-white ${page === "users" ? "fw-bold" : ""}`}
            onClick={() => setPage("users")}
          >
            Usuários
          </button>
        )}
      </div>

      <div className="d-flex align-items-center gap-3 px-3">
        <span className="text-white small">
          {user.nome} ({user.role})
        </span>
        <button className="btn btn-outline-light btn-sm px-4" onClick={onLogout}>
          Sair
        </button>
      </div>
    </nav>
    );
};