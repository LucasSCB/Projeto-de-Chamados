// src/middlewares/errorHandler.js
function errorHandler(err, req, res, next) {
  const status = Number(err?.status || err?.statusCode || 500);
  const isTest = process.env.NODE_ENV === "test";

  if(!isTest){
  console.error("🔥 ERROR:", err);
}
  return res.status(status).json({
    error: err?.code || "INTERNAL_ERROR",
    message: err?.message || "Erro interno do servidor",
  });
}

module.exports = errorHandler;
