// src/controllers/users.controller.js
const usersService = require("../services/users.service");

async function list(req, res, next) {
  try {
    const data = await usersService.listUsers();
    return res.json({ data });
  } catch (err) {
    return next(err);
  }
}

async function create(req, res, next) {
  try {
    const { nome, email, senha, role } = req.body;
    const data = await usersService.createUser({ nome, email, senha, role });
    return res.status(201).json({ data });
  } catch (err) {
    return next(err);
  }
}

module.exports = { list, create };
