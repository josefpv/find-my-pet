const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { randomBytes } = require("crypto");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const axios = require("axios");
const bd = require("./bd/queries");
const bcrypt = require("bcryptjs");

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

bd.connection();

//inicia sesion
app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  let matchPass = false;

  if (!email || !password) {
    res.status(401).send({ msg: "Email o password invalido" });
    return;
  }

  //bd.connection();
  const result = await bd.buscaUsuario([email]);
  console.log("Resultado user: ", result);

  if (result.length) {
    const passEncriptada = result[0].password;
    matchPass = await bcrypt.compare(password, passEncriptada);
  } else {
    return res.status(400).send({ message: "No se han conseguido usuario." });
  }

  if (matchPass) {
    const {
      id,
      nombre,
      apellido,
      telefono,
      comuna_id,
      region_id,
      direccion,
      cliente,
    } = result[0];

    const infoUsuario = {
      id,
      nombre,
      apellido,
      email,
      telefono,
      comuna_id,
      region_id,
      direccion,
      cliente,
    };
    //genera token
    //expira en 2 horas
    const token = jwt.sign({ username: email }, process.env.TOKEN_SECRET, {
      expiresIn: "7200s",
    });

    axios.post("http://api-event-bus:4002/events", {
      type: "userLogin",
      payload: { email },
    });

    axios.post("http://api-event-bus:4002/events", {
      type: "tokenGenerated",
      payload: {
        token,
      },
    });

    res.send({ token, infoUsuario });
  } else {
    res.status(401).send({ msg: "Email o password invalido" });
  }
});

//crea usuario
app.post("/user/", async (req, res) => {
  const {
    nombre,
    apellido,
    email,
    password,
    telefono,
    comunaId,
    regionId,
    direccion,
  } = req.body;
  const rondasDeSal = 10;

  //verifica que usuario no exista
  const { length } = await bd.buscaUsuario([email]);
  if (Boolean(length)) {
    return res.status(400).send({ msg: "Usuario ya existe" });
  }

  const passEncriptada = await bcrypt.hash(password, rondasDeSal);

  //bd.connection();
  const result = await bd.registra_usuario([
    nombre,
    apellido,
    email,
    passEncriptada,
    telefono,
    comunaId,
    regionId,
    direccion,
  ]);
  const id = result[0].id;
  res.status(200).send({ id });
});

app.put("/user/actualiza", validateToken, async (req, res) => {
  const rondasDeSal = 10;
  const {
    id,
    nombre,
    apellido,
    email,
    password,
    telefono,
    regionId,
    comunaId,
    direccion,
  } = req.body;
  console.log("recibido: ", req.body);

  //verifica que usuario no exista
  const { length } = await bd.buscaUsuario([email]);
  if (Boolean(length)) {
    let result = null;
    //usuario existe
    if (password) {
      const passEncriptada = await bcrypt.hash(password, rondasDeSal);
      result = await bd.actualiza_usuario(
        [
          nombre,
          apellido,
          passEncriptada,
          telefono,
          regionId,
          comunaId,
          direccion,
          id,
        ],
        true
      );
    } else {
      result = await bd.actualiza_usuario(
        [nombre, apellido, telefono, regionId, comunaId, direccion, id],
        false
      );
    }

    if (result[0].id) {
      return res.status(200).send({ msg: "Usuario actualizado correctamente" });
    }

    return res
      .status(400)
      .send({ msg: "Ha ocurrido un error al intentar actualizar el usuario" });
  }

  return res.status(400).send({ msg: "Usuario no encontrado." });
});

//verifica email usuario
app.post("/user/verifica/email", async (req, res) => {
  const { email } = req.body;

  const { length } = await bd.buscaUsuario([email]);
  if (Boolean(length)) {
    res.status(200).send({ msg: false });
  } else {
    res.status(200).send({ msg: true });
  }
});

//busca usuario
app.post("/user/buscar", async (req, res) => {
  const { email } = req.body;

  const result = await bd.buscaUsuario([email]);
  if (result) {
    res.status(200).send(result);
  } else {
    res.status(204).send({ message: "No se han conseguido usuario." });
  }
});

//obtiene regiones
app.get("/user/regiones", async (req, res) => {
  const result = await bd.obtieneRegiones();
  if (result) {
    res.status(200).send(result);
  } else {
    res.status(400).send({ msg: "No se han conseguido regiones." });
  }
});
//obtiene comunad
app.get("/user/regiones/:comuna", async (req, res) => {
  const { comuna } = req.params;
  const result = await bd.obtieneComunas([comuna]);
  if (result) {
    res.status(200).send(result);
  } else {
    res.status(400).send({ msg: "No se han conseguido regiones." });
  }
});

app.post("/auth/validate/session", validateToken, (req, res) => {
  console.log("USER: ", req.usuario);
  res.status(200);
  res.send(req.usuario);
});

app.get("/clientes", validateToken, async (req, res) => {
  const resultado = await bd.obtieneClientes();

  if (resultado[0]) {
    return res.status(200).send({ clientes: resultado });
  }

  return res.status(400).send({ msg: "No se han conseguido clientes" });
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

app.post("/events", (req, res) => {
  const { type, payload } = req.body;
  console.log("Event received: ", type);
  res.status(200).send({});
});

app.listen(4001, () => {
  console.log("Auth => Listening on 4001");
});
