const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { randomBytes } = require("crypto");
const _ = require("lodash");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const fs = require("fs");
const gc = require("./config/");
const bucket = gc.bucket("find_my_pet_pets_images");
//bd
const bd = require("./bd/queries");

dotenv.config();
const app = express();
app.use(bodyParser.json());
app.use(cors());

const mascotas = {};

bd.connection();

//lista todas las mascotas
app.get("/mascotas", validateToken, (req, res) => {
  res.send(mascotas);
});

//obtiene mascotas del usuario
app.get("/mascotas/usuario/:id", validateToken, async (req, res) => {
  let urlImagenes = {};
  const id = req.params.id;
  //bd.connection();
  const result = await bd.lista_mascotas_usuario([id]);

  if (result.length) {
    //bussca imagenes

    //`http://storage.googleapis.com/find_my_pet_pets_images/${img.name}`
    await Promise.all(
      result.map(async (fila) => {
        let idMascota = fila.id;
        const [files] = await bucket.getFiles({
          prefix: `pets/pet_user_${id}/pet_${idMascota}`,
        });
        console.log("FILES: ", files);
        urlImagenes[idMascota] = files.map((imagen) => {
          return `http://storage.googleapis.com/find_my_pet_pets_images/${imagen.name}`;
        });
      })
    );
    //console.log("URLS: ", urlImagenes);
    res.status(200).send({ mascotas: result, urlImagenes });
  } else {
    res.status(400).send({ msg: "No se ha conseguido la mascotas" });
  }
});

//obtiene informacion de la mascota
app.get("/mascota/:idMascota", validateToken, async (req, res) => {
  let urlImagenes = [];
  const { idMascota } = req.params;
  //bd.connection();
  const result = await bd.busca_mascota_by_id([idMascota]);

  if (result[0]) {
    //look up for photos
    console.log(`pets/pet_user_${result[0].propietario_id}/pet_${idMascota}`);
    const [files] = await bucket.getFiles({
      prefix: `pets/pet_user_${result[0].propietario_id}/pet_${idMascota}`,
    });

    urlImagenes = files.map((imagen) => {
      return `http://storage.googleapis.com/find_my_pet_pets_images/${imagen.name}`;
    });

    res.status(200).send({ infoMascota: result[0], urlImagenes });
  } else {
    res
      .status(204)
      .send({ message: "No se ha conseguido la mascota solicitada" });
  }
});

//agrega nueva mascota
app.post("/mascotas", validateToken, async (req, res) => {
  //const id = randomBytes(4).toString("hex");
  const {
    nombre,
    descripcion,
    fechaNacimiento,
    tamano,
    colorPrincipal,
    colorSecundario,
    especie,
    genero,
    razaId,
    propietarioId,
    estadoId,
    nombreAlterno,
  } = req.body;

  //ad to bd
  //bd.connection();
  const result = await bd.registra_mascota([
    nombre,
    descripcion,
    tamano,
    colorPrincipal,
    colorSecundario,
    genero,
    razaId ? razaId : 0,
    propietarioId,
    estadoId,
    nombreAlterno,
    especie,
  ]);

  const id = result[0].id;
  const mascota_nueva = {
    id,
    nombre,
    descripcion,
    fechaNacimiento,
    tamano,
    colorPrincipal,
    colorSecundario,
    especie,
    genero,
    razaId,
    propietarioId,
    estadoId,
    nombreAlterno,
  };

  if (id) {
    const dataQR = {
      serialQR: req.body.serial,
      claveQR: req.body.clave,
      ...mascota_nueva,
    };

    //console.log("DATA QR: ", dataQR);
    //envia evento a event bus para que lo reciba servicio de QR
    axios
      .post("http://api-event-bus:4002/events", {
        type: "ASIGNA_QR",
        payload: dataQR,
      })
      .catch((error) => console.log(error));

    res.status(200).send(mascota_nueva);
  } else {
    res.status(400).send({ msg: "No se ha podido registrar la mascota" });
  }
});

//edita mascota
app.put("/mascotas/edita", validateToken, async (req, res) => {
  const {
    id,
    nombre,
    descripcion,
    tamano,
    color1,
    color2,
    especie,
    genero,
    raza,
    nombre_alterno,
    estadoId,
    propietario_id,
    fotosUrl,
    fotosEliminadas,
  } = req.body;

  console.log("Dato a actulizar: ", req.body);

  const result = await bd.busca_mascota_by_id([id]);

  if (result[0]) {
    //bd.connection();
    const resultado_actualiza = await bd.actualiza_mascota([
      nombre,
      descripcion,
      tamano,
      color1,
      color2,
      genero,
      raza,
      estadoId,
      nombre_alterno,
      id,
    ]);
    const campos_actualizados = {
      id,
      nombre,
      descripcion,
      tamano,
      color1,
      color2,
      genero,
      raza,
      estadoId,
      nombre_alterno,
      propietario_id,
    };

    console.log("RESULTADO ACTUALIZA: ", resultado_actualiza);

    if (!resultado_actualiza[0].id) {
      //no actualizo
      res.status(400).send({
        message: "Ocurrio un error al intentar actualziar a la mascota.",
      });
    } else {
      //envia evento a event bus para que lo reciba servicio de uploader
      if (fotosEliminadas.length > 0) {
        console.log(
          "Envia evento de eliminar fotos!!!!!!!!!!1",
          fotosEliminadas.length
        );
        axios
          .post("http://api-event-bus:4002/events", {
            type: "ELIMINA_FOTOS",
            payload: fotosEliminadas,
          })
          .catch((error) => console.log(error));
      }
      res
        .status(200)
        .send([
          { message: "Mascota actualizada con exito" },
          campos_actualizados,
        ]);
    }
  } else {
    res
      .status(404)
      .send({ message: "No se ha conseguido la mascota solicitada" });
  }
});

//elimina mascota
app.delete("/mascotas/:idusuario/:idmascota", async (req, res) => {
  const { idusuario, idmascota } = req.params;
  console.log("Se eliminara mascota con ID: ", idmascota);
  console.log("del usuario: ", idusuario);

  // se elimina mascota de la base de datos
  const resultado = await bd.elimina_msacota([idmascota]);
  //console.log("resultado elimina mascota: ", resultado);

  if (resultado.length) {
    // se envia evento para eliminar informacion del bukcet
    axios
      .post("http://api-event-bus:4002/events", {
        type: "ELIMINA_CARPETA_FOTOS",
        payload: { idusuario, idmascota },
      })
      .catch((error) => console.log(error));

    // se envia evento para desactivar el qr
    axios
      .post("http://api-event-bus:4002/events", {
        type: "DESACTIVA_QR",
        payload: { idusuario, idmascota },
      })
      .catch((error) => console.log(error));

    return res.status(200).send({
      msg: "Se ha eliminado la mascota correctamente.",
    });
  }

  return res.status(400).send({
    msg: "Ha ocurrido un error al intentar eliminar la mascota, por favor intente nuevamente.",
  });
});

//obtiene razas
app.get("/mascotas/razas/:especie_id", async (req, res) => {
  const especie_id = req.params.especie_id;
  //bd.connection();
  const result = await bd.busca_raza_by_especie(especie_id);
  if (result) {
    res.status(200).send(result);
  } else {
    res
      .status(204)
      .send({ message: "No se han conseguido razas segun especie informada." });
  }
});

//obtiene especie
app.get("/mascotas/especies/todas", async (req, res) => {
  //bd.connection();
  const result = await bd.obtiene_especies();
  if (result) {
    res.status(200).send(result);
  } else {
    res.status(204).send({ message: "No se han conseguido respecies." });
  }
});

//obtiene mascota desde serial QR
app.get("/mascota/perfil/:serial", async (req, res) => {
  const { serial } = req.params;
  let urlImagenes = [];

  //se valida primero serial del QR
  const response = await axios.post("http://api-qr:4003/qrs/serial/valida", {
    serial,
  });
  if (response.status == 200) {
    if (response.data.valido) {
      //El serial del QR es valido, se busca info de la mascota asociada al QR
      const infoMascota = await bd.busca_mascota_by_id([
        response.data.mascotaId,
      ]);

      const userId = infoMascota[0].propietario_id;
      const mascotaId = infoMascota[0].id;

      const [files] = await bucket.getFiles({
        prefix: `pets/pet_user_${userId}/pet_${mascotaId}`,
      });

      urlImagenes = files.map((imagen) => {
        return `http://storage.googleapis.com/find_my_pet_pets_images/${imagen.name}`;
      });

      return res
        .status(200)
        .send({ msg: "QR valido", infoMascota: infoMascota[0], urlImagenes });
    } else {
      console.log("QR NO Valido");
      return res.status(400).send({ msg: "QR NO valido" });
    }
  }

  return res.status(400).send({ msg: "Error al intentar validar QR" });
});

app.post("/events", (req, res) => {
  const { type, payload } = req.body;
  console.log("Event received: ", type);

  if (type == "tokenGenerated") {
    jwt.verify(payload.token, process.env.TOKEN_SECRET, (err, user) => {
      if (err) {
        console.log({ msg: "Invalid token" });
        return res.sendStatus(403);
      } else {
        console.log({ msg: "Valid token" });
        return res.sendStatus(200);
      }
    });
  } else {
    res.status(200).send({});
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

app.listen(4000, () => {
  console.log("Mascotas => Listening on 4000");
});
