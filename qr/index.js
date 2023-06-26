const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { randomBytes } = require("crypto");
const _ = require("lodash");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const axios = require("axios");
//bd
const bd = require("./bd/queries");

dotenv.config();
const app = express();
app.use(bodyParser.json());
app.use(cors());

bd.connection();

//obtiene todos los qrs
app.get("/qrs", validateToken, async (req, res) => {
  const resultado = await bd.obtieneQrs();

  if (resultado) {
    res.status(200).send(resultado);
  } else {
    res.status(400).send({ msg: "No se han conseguido QRs." });
  }
});

//app.post("/qrs/valida", validateToken, async (req, res) => {
app.post("/qrs/valida", async (req, res) => {
  const { serial, clave } = req.body;

  const result = await bd.validaQR([serial, clave]);
  if (result[0]) {
    res.status(200).send({ valido: true });
  } else {
    res.status(202).send({ message: "QR no valido" });
  }
});

app.post("/qrs/serial/valida", async (req, res) => {
  const { serial } = req.body;

  const result = await bd.validaSerialQR([serial]);
  if (result[0]) {
    res.status(200).send({ valido: true, mascotaId: result[0].mascota_id });
  } else {
    res.status(202).send({ message: "QR no valido" });
  }
});

app.post("/qrs/nuevo", validateToken, async (req, res) => {
  const result = await bd.creaQR();
  console.log("SERIAL CREADO: ", result);
  //const id = result[0].id;
  if (result) {
    res.status(200).send({ result });
  } else {
    res.status(202).send({ message: "No se pudo crear QR" });
  }
});

app.post("/qr/desactiva", async (req, res) => {
  const { idusuario, idmascota } = req.body;

  const result = await bd.desactivaQR([idusuario, idmascota]);
  console.log("Resulta desactiva QR: ", result);
  const id = result[0].id;
  if (result[0]) {
    res.status(200).send({ msg: "Se ha desactivado el QR correctamente", id });
  } else {
    res.status(400).send({ message: "No se pudo desactivando el QR" });
  }
});

app.post("/qr/asigna", async (req, res) => {
  const {
    serialQR,
    claveQR,
    id: mascotaId,
    propietarioId: usuarioId,
  } = req.body;

  console.log(serialQR, claveQR, mascotaId, usuarioId);
  const fecha_activacion = new Date();

  //bd.connection();
  const result = await bd.asignaQR([
    mascotaId,
    usuarioId,
    fecha_activacion,
    true,
    serialQR,
    claveQR,
  ]);
  console.log("Resulta Asigna QR: ", result);
  const id = result[0].id;
  if (result[0]) {
    res.status(200).send({ msg: "Se ha asignado el QR correctamente", id });
  } else {
    res.status(400).send({ message: "No se pudo asignar el QR" });
  }
});

app.put("/qr/cambia/estado", validateToken, async (req, res) => {
  const { estado, id } = req.body;

  console.log(req.body);

  const resultado = await bd.toggleEstado([estado, id]);

  if (resultado) {
    return res.status(200).send({ id: resultado[0].id });
  }

  return res
    .status(400)
    .send({ msg: "No se ha podido activar/desactivar el QR" });
});

app.post("/events", (req, res) => {
  const { type, payload } = req.body;
  console.log("Event received: ", type);

  if (type == "tokenGenerated") {
    jwt.verify(payload.token, process.env.TOKEN_SECRET, (err, user) => {
      if (err) {
        console.log({ msg: "Invalid token" });
        res.sendStatus(403);
      } else {
        console.log({ msg: "Valid token" });
        res.sendStatus(200);
      }
    });
  }

  if (type == "ASIGNA_QR") {
    //se asigna QR a mascota
    axios
      .post("http://api-qr:4003/qr/asigna", payload)
      .catch((error) => console.log(error));
  }

  if (type == "DESACTIVA_QR") {
    axios
      .post("http://api-qr:4003/qr/desactiva", payload)
      .catch((error) => console.log(error));
  }
});

function validateToken(req, res, next) {
  const auth = req.headers["authorization"];
  console.log("TOKEN: ", auth);
  const token = auth && auth.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    console.log(err);

    if (err) return res.sendStatus(403);

    req.usuario = user;
    next();
  });
}

app.listen(4003, () => {
  console.log("QR => Listening on 4003");
});
