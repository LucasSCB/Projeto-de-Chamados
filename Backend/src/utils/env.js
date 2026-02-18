require("dotenv").config();

const env = {
  PORT: process.env.PORT ? Number(process.env.PORT) : 3000,
  JWT_SECRET: process.env.JWT_SECRET || "dev_secret",
  NODE_ENV: process.env.NODE_ENV || "development",
};

module.exports = { env };
