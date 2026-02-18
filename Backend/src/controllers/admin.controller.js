// src/controllers/admin.controller.js
const adminService = require("../services/admin.service");
const usersService = require("../services/users.service");

async function stats(req, res, next) {
  try {
    const data = await adminService.stats();
    // o front espera o objeto direto (sem wrapper)
    return res.json(data);
  } catch (err) {
    return next(err);
  }
}

async function listUsers(req, res, next) {
  try {
    const data = await usersService.listUsers();
    return res.json(data);
  } catch (err) {
    return next(err);
  }
}

async function createUser(req, res, next) {
  try {
    const { nome, email, senha, role, setor } = req.body;
    const data = await usersService.createUser({ nome, email, senha, role, setor });
    return res.status(201).json(data);
  } catch (err) {
    return next(err);
  }
}

async function deleteUser(req, res, next) {
  try {
    const data = await usersService.deleteUser({
      id: req.params.id,
      actor: req.user,
    });
    return res.json(data);
  } catch (err) {
    return next(err);
  }
}

module.exports = { stats, listUsers, createUser, deleteUser };
