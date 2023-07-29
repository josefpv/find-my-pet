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
    .catch((err) => console.log("Error when connecting to bd", err));
};

module.exports.lista_mascotas = async function () {
  try {
    const resultado = await pgClient.query(
      `SELECT * FROM "find-my-pet".mascotas`
    );
    //pgClient.end();
    return resultado;
  } catch (error) {
    console.error("Query error: ", error);
  }
};

module.exports.lista_mascotas_usuario = async function (array_values) {
  try {
    const resultado = await pgClient.query(
      `SELECT ` +
        `masc.id, masc.nombre,  ` +
        `masc.descripcion, masc.tamano, ` +
        `masc.color_principal, masc.color_secundario, ` +
        `masc.genero, masc.raza_id, ` +
        `masc.propietario_id, ` +
        `masc.estado_id, masc.nombre_alterno, ` +
        `masc.especie_id, espec.nombre especie ` +
        `FROM "find-my-pet".mascotas masc ` +
        `LEFT JOIN "find-my-pet".especie espec ON masc.especie_id = espec.id ` +
        `WHERE masc.propietario_id = $1 AND masc.estado_id = 1`,
      array_values
    );
    //pgClient.end();
    //console.log(resultado);
    return JSON.parse(JSON.stringify(resultado.rows));
  } catch (error) {
    console.error("Query error: ", error);
  }
};

module.exports.registra_mascota = async function (array_values) {
  try {
    //console.log("VALORES: ", array_values);
    const resultado = await pgClient.query(
      `INSERT INTO "find-my-pet".mascotas ( ` +
        `nombre, descripcion, tamano, color_principal, color_secundario, genero, raza_id, propietario_id, estado_id, nombre_alterno, especie_id) ` +
        `VALUES ( ` +
        `$1, ` +
        `$2, ` +
        `$3, ` +
        `$4, ` +
        `$5, ` +
        `$6, ` +
        `$7, ` +
        `$8, ` +
        `$9, ` +
        `$10, ` +
        `$11 ) RETURNING id `,
      array_values
    );
    //pgClient.end();
    return JSON.parse(JSON.stringify(resultado.rows));
  } catch (error) {
    console.error("Insert error: ", error);
  }
};

module.exports.busca_mascota_by_id = async function (array_values) {
  try {
    const resultado = await pgClient.query(
      `SELECT ` +
        `masc.id, masc.nombre,  ` +
        `masc.descripcion, masc.tamano, ` +
        `masc.color_principal color1, masc.color_secundario color2, ` +
        `masc.genero, masc.raza_id raza, ` +
        `masc.propietario_id, ` +
        `prop.nombre nombre_propietario, ` +
        `prop.apellido apellido_propietario, ` +
        `prop.email, ` +
        `prop.telefono, ` +
        `masc.estado_id, masc.nombre_alterno nombre_alterno, ` +
        `masc.especie_id especie, espec.nombre especieTexto ` +
        `FROM "find-my-pet".mascotas masc ` +
        `LEFT JOIN "find-my-pet".especie espec ON masc.especie_id = espec.id ` +
        `LEFT JOIN "find-my-pet".usuarios prop ON prop.id = masc.propietario_id ` +
        `WHERE masc.id = $1 `,
      array_values
    );
    console.log("Resultado busqueda: ", resultado.rows);
    //pgClient.close();
    return JSON.parse(JSON.stringify(resultado.rows));
  } catch (error) {
    console.log("ERROR CONSULTA: ", error);
  }
};

module.exports.actualiza_mascota = async function (array_values) {
  try {
    const resultado = await pgClient.query(
      `UPDATE "find-my-pet".mascotas SET ` +
        `nombre = $1, ` +
        `descripcion = $2, ` +
        `tamano = $3, ` +
        `color_principal = $4, ` +
        `color_secundario = $5, ` +
        `genero = $6, ` +
        `raza_id = $7, ` +
        `estado_id = $8, ` +
        `nombre_alterno = $9 ` +
        `WHERE id = $10 RETURNING id `,
      array_values
    );

    //pgClient.end();
    return JSON.parse(JSON.stringify(resultado.rows));
  } catch (error) {
    console.error("ERROR AL ACTUALIZAR: ", error);
  }
};

module.exports.elimina_msacota = async function (array_values) {
  try {
    const resultado = await pgClient.query(
      `DELETE FROM "find-my-pet".mascotas WHERE id = $1 RETURNING id`,
      array_values
    );
    return JSON.parse(JSON.stringify(resultado.rows));
  } catch (error) {
    console.error("ERROR AL ELIMINAR: ", error);
  }
};

module.exports.busca_raza_by_especie = async function (especie_id) {
  try {
    const resultado = await pgClient.query(
      `SELECT * FROM "find-my-pet".raza WHERE especie_id = ${especie_id}`
    );

    //pgClient.end();
    return JSON.parse(JSON.stringify(resultado.rows));
  } catch (error) {
    console.error("ERROR AL CONSULTAR RAZAS POR ID: ", error);
  }
};

module.exports.obtiene_especies = async function () {
  try {
    const resultado = await pgClient.query(
      `SELECT * FROM "find-my-pet".especie`
    );

    //pgClient.end();
    return JSON.parse(JSON.stringify(resultado.rows));
  } catch (error) {
    console.error("ERROR AL CONSULTAR ESPECIES: ", error);
  }
};
