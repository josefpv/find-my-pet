const { json } = require("express");
const { Pool } = require("pg");
const keys = require("../keys");
let pgClient;

module.exports.connection = function () {
  pgClient = new Pool({
    host: keys.pgHost,
    port: keys.pgPort,
    user: keys.pgUser,
    password: keys.pgPassword,
  });

  pgClient
    .connect()
    .then(() => console.log("Connected to BD!"))
    .catch((err) => console.log("Error when connecting to bd"));
};

module.exports.registra_usuario = async function (array_values) {
  try {
    // console.log("VALORES: ", array_values);
    const resultado = await pgClient.query(
      `INSERT INTO "find-my-pet".usuarios ( ` +
        `nombre, apellido, email, password, telefono, comuna_id, region_id, direccion) ` +
        `VALUES (` +
        `$1, ` +
        `$2, ` +
        `$3, ` +
        `$4, ` +
        `$5, ` +
        `$6, ` +
        `$7, ` +
        `$8 ) RETURNING id; `,
      array_values
    );
    //pgClient.end();
    return JSON.parse(JSON.stringify(resultado.rows));
  } catch (error) {
    console.error("Insert error: ", error);
  }
};

module.exports.actualiza_usuario = async function (
  array_values,
  actualiza_contraseña
) {
  try {
    let resultado = null;

    if (actualiza_contraseña) {
      resultado = await pgClient.query(
        `UPDATE "find-my-pet".usuarios SET ` +
          `nombre = $1, ` +
          `apellido = $2, ` +
          `password = $3, ` +
          `telefono = $4, ` +
          `region_id = $5, ` +
          `comuna_id = $6, ` +
          `direccion = $7 ` +
          `WHERE id = $8 RETURNING id; `,
        array_values
      );
    } else {
      resultado = await pgClient.query(
        `UPDATE "find-my-pet".usuarios SET ` +
          `nombre = $1, ` +
          `apellido = $2, ` +
          `telefono = $3, ` +
          `region_id = $4, ` +
          `comuna_id = $5, ` +
          `direccion = $6 ` +
          `WHERE id = $7 RETURNING i`,
        array_values
      );
    }
    return JSON.parse(JSON.stringify(resultado.rows));
  } catch (error) {
    console.error("Update error: ", error);
  }
};

module.exports.buscaUsuario = async function (array_values) {
  try {
    //console.log("VALORES: ", array_values);
    const resultado = await pgClient.query(
      `SELECT * FROM "find-my-pet".usuarios WHERE email = $1`,
      array_values
    );
    //pgClient.end();
    return JSON.parse(JSON.stringify(resultado.rows));
  } catch (error) {
    console.error("Insert error: ", error);
  }
};

module.exports.obtieneRegiones = async function () {
  try {
    const resultado = await pgClient.query(
      `SELECT * FROM "find-my-pet".region`
    );
    return JSON.parse(JSON.stringify(resultado.rows));
  } catch (error) {
    console.log("Error obtiene regiones: ", error);
  }
};

module.exports.obtieneComunas = async function (array_values) {
  try {
    const resultado = await pgClient.query(
      `SELECT * FROM "find-my-pet".comuna WHERE region_id = $1`,
      array_values
    );
    return JSON.parse(JSON.stringify(resultado.rows));
  } catch (error) {
    console.log("Error obtiene regiones: ", error);
  }
};

module.exports.obtieneClientes = async function () {
  try {
    const query =
      `SELECT ` +
      `us.id, ` +
      `us.nombre, ` +
      `us.apellido, ` +
      `us.email, ` +
      `us.telefono, ` +
      `co.nombre comuna, ` +
      `reg.nombre region, ` +
      `us.direccion ` +
      `FROM "find-my-pet".usuarios us ` +
      `LEFT JOIN "find-my-pet".region reg ON reg.id = us.region_id ` +
      `LEFT JOIN "find-my-pet".comuna co ON co.id = us.comuna_id ` +
      `WHERE us.cliente = true; `;
    const resultado = await pgClient.query(query);
    //pgClient.end();
    return JSON.parse(JSON.stringify(resultado.rows));
  } catch (error) {
    console.error("Insert error: ", error);
  }
};
