const { json } = require("express");
const { Pool } = require("pg");
const { randomBytes } = require("crypto");
let pgClient;

module.exports.connection = function () {
  pgClient = new Pool({
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
  });

  pgClient
    .connect()
    .then(() => console.log("Connected to BD!"))
    .catch((err) => console.log("Error when connecting to bd"));
};

module.exports.creaQR = async function () {
  try {
    const serial = randomBytes(9).toString("hex").slice(0, 10);
    const clave = randomBytes(7).toString("hex").slice(0, 8);

    console.log("SERIAL: ", serial);
    console.log("CLAVE: ", clave);

    const resultado = await pgClient.query(
      `INSERT INTO "find-my-pet".qrs(serial, clave, activo) VALUES ($1, $2, true) RETURNING id `,
      [serial, clave]
    );

    //pgClient.end();
    return serial;
  } catch (error) {
    console.log("ERROR CREANDO QR: ", error);
  }
};

module.exports.validaQR = async function (array_values) {
  try {
    const resultado = await pgClient.query(
      `SELECT * FROM "find-my-pet".qrs WHERE  serial = $1 AND clave = $2 AND mascota_id IS NULL AND activo = true`,
      array_values
    );
    //pgClient.end();
    return JSON.parse(JSON.stringify(resultado.rows));
  } catch (error) {
    console.log("ERROR VALIDANDO QR: ", error);
  }
};

module.exports.validaSerialQR = async function (array_values) {
  try {
    const resultado = await pgClient.query(
      `SELECT mascota_id FROM "find-my-pet".qrs WHERE serial = $1 AND activo = true`,
      array_values
    );
    //pgClient.end();
    return JSON.parse(JSON.stringify(resultado.rows));
  } catch (error) {
    console.log("ERROR VALIDANDO SERIAL QR: ", error);
  }
};

module.exports.asignaQR = async function (array_values) {
  try {
    const resultado = await pgClient.query(
      `UPDATE "find-my-pet".qrs SET mascota_id = $1, usuario_id = $2, fecha_activacion = $3, activo = $4 WHERE serial = $5 AND clave = $6 RETURNING id`,
      array_values
    );

    //pgClient.end();
    return JSON.parse(JSON.stringify(resultado.rows));
  } catch (error) {
    console.log("ERROR VALIDANDO QR: ", error);
  }
};

module.exports.desactivaQR = async function (array_values) {
  try {
    const resultado = await pgClient.query(
      `UPDATE "find-my-pet".qrs SET activo = false WHERE usuario_id = $1 AND mascota_id = $2 RETURNING id`,
      array_values
    );

    //pgClient.end();
    return JSON.parse(JSON.stringify(resultado.rows));
  } catch (error) {
    console.log("ERROR DESACTIVANDO QR: ", error);
  }
};

module.exports.obtieneQrs = async function () {
  try {
    const query =
      `SELECT ` +
      `qr.id,  ` +
      `qr.serial, ` +
      `qr.clave, ` +
      `mascota.nombre  mascota, ` +
      `qr.fecha_solicitud, ` +
      `usuario.email usuario, ` +
      `qr.fecha_activacion, ` +
      `qr.fecha_vencimiento, ` +
      `qr.activo, ` +
      `qr.url ` +
      `from "find-my-pet".qrs qr ` +
      `LEFT JOIN "find-my-pet".mascotas mascota ON mascota.id = qr.mascota_id ` +
      `LEFT JOIN "find-my-pet".usuarios usuario ON usuario.id = qr.usuario_id ORDER BY qr.id ASC `;

    const resultado = await pgClient.query(query);
    //pgClient.end();
    return JSON.parse(JSON.stringify(resultado.rows));
  } catch (error) {
    console.log("ERROR OBTENIENDO SERIAL QR: ", error);
  }
};

module.exports.toggleEstado = async function (array_values) {
  try {
    const resultado = await pgClient.query(
      `UPDATE "find-my-pet".qrs SET activo = $1 WHERE id = $2 RETURNING id`,
      array_values
    );

    //pgClient.end();
    return JSON.parse(JSON.stringify(resultado.rows));
  } catch (error) {
    console.log("ERROR TOGGLING QR: ", error);
  }
};
