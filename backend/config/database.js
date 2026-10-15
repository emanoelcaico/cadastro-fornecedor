module.exports = {
  development: {
    username: "root",
    password: "Caico@216!", // 👈 troque pela senha que você usa no Workbench
    database: "cadastro_fornecedor",
    host: "127.0.0.1",
    port: 3306,
    dialect: "mysql",
    logging: false, // deixa o console limpo
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: 3306,
    dialect: "mysql",
    logging: false,
  },
};