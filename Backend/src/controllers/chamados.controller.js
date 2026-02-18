// src/controllers/chamados.controller.js
const chamadosService = require("../services/chamados.service");

async function list(req, res, next) {
  try {
    const { page, limit, q, status } = req.query;

    const result = await chamadosService.listChamados({
      user: req.user,
      page,
      limit,
      q,
      status,
    });

    return res.json(result); // { data, meta }
  } catch (err) {
    return next(err);
  }
}

async function getById(req, res, next) {
  try {
    const data = await chamadosService.getChamadoById({
      id: req.params.id,
      user: req.user,
    });
    return res.json({ data });
  } catch (err) {
    return next(err);
  }
}

async function create(req, res, next) {
  try {
    const { titulo, descricao } = req.body;

    const data = await chamadosService.createChamado({
      titulo,
      descricao,
      user: req.user,
    });

    return res.status(201).json({ data });
  } catch (err) {
    return next(err);
  }
}

async function setStatus(req, res, next) {
  try {
    const { status } = req.body;

    const data = await chamadosService.updateStatus({
      id: req.params.id,
      status,
      user: req.user,
    });

    return res.json({ data });
  } catch (err) {
    return next(err);
  }
}

async function remove(req, res, next) {
  try {
    const data = await chamadosService.removeChamado({
      id: req.params.id,
      user: req.user,
    });

    return res.json(data);
  } catch (err) {
    return next(err);
  }
}

module.exports = { list, getById, create, setStatus, remove };
