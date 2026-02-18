// src/server.js
require("dotenv").config();

const app = require("./app");
const { env } = require("./utils/env");

app.listen(env.PORT, () => {
  console.log(`API rodando em http://localhost:${env.PORT}`);
});
