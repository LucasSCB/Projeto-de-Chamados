const { login } = require("../services/auth.service");

async function loginController(req, res, next) {
  try {
    const { email, senha } = req.body;
    const result = await login({ email, senha });
    return res.json(result);
  } catch (err) {
    return next(err);
  }
}

module.exports = { loginController };
