import { useEffect, useState } from "react";
import Login from "./pages/Login";
import Chamados from "./pages/Chamados";
import UsersAdmin from "./pages/UsersAdmin";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";


export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("chamados");

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setPage("chamados");
  }

  if (!user) return <Login onLogin={setUser} />;

  return (
    <>
      <Navbar
        user={user}
        page={page}
        setPage={setPage}
        onLogout={logout}
      />

      {page === "chamados" && <Chamados user={user} />}
      {page === "users" && user.role === "ADMIN" && <UsersAdmin />}
      {page === "dashboard" && user.role === "ADMIN" && <Dashboard />}

    </>
  );
}
