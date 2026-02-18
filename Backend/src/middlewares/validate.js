// src/middlewares/validate.js
// Validador simples (sem libs). Use assim:
// router.post("/", validateBody(["titulo","descricao"]), handler)
function validateBody(required = []) {
  return (req, res, next) => {
    const missing = required.filter((k) => {
      const v = req.body?.[k];
      return v === undefined || v === null || String(v).trim() === "";
    });

    if (missing.length) {
      return res.status(400).json({
        error: "VALIDATION_ERROR",
        message: `Campos obrigatórios: ${missing.join(", ")}`,
      });
    }

    return next();
  };
}

module.exports = { validateBody };
