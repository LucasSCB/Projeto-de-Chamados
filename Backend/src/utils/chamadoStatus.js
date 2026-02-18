// src/utils/chamadoStatus.js
const CHAMADO_STATUS = {
  ABERTO: "ABERTO",
  EM_ANDAMENTO: "EM_ANDAMENTO",
  FECHADO: "FECHADO",
};

const CHAMADO_STATUS_VALUES = Object.values(CHAMADO_STATUS);

function normalizeStatus(input) {
  return String(input || "").trim().toUpperCase();
}

function assertValidStatus(input) {
  const status = normalizeStatus(input);
  if (!CHAMADO_STATUS_VALUES.includes(status)) {
    const e = new Error(
      `Status inválido. Use: ${CHAMADO_STATUS_VALUES.join(", ")}`
    );
    e.status = 400;
    e.code = "INVALID_STATUS";
    throw e;
  }
  return status;
}

module.exports = {
  CHAMADO_STATUS,
  CHAMADO_STATUS_VALUES,
  normalizeStatus,
  assertValidStatus,
};
