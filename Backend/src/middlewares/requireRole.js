// src/middlewares/requireRole.js
function requireRole(...roles) {
  const allowed = roles.map((r) => String(r).trim().toUpperCase());

  return (req, res, next) => {
    const userRole = String(req.user?.role || "").trim().toUpperCase();

    if (!allowed.includes(userRole)) {
      const e = new Error("Sem permissão");
      e.status = 403;
      e.code = "FORBIDDEN";
      return next(e);
    }

    return next();
  };
}

module.exports = { requireRole };
