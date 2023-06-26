const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors");
const _ = require("lodash");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const fs = require("fs");
const gc = require("./config/");
const bucket = gc.bucket("find_my_pet_pets_images");

dotenv.config();
const app = express();
app.use(bodyParser.json());
app.use(cors());

//especificando destino
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const { userId, mascotaId } = req.body;
    if (fs.existsSync(`./uploads/mascotas/${userId}/${mascotaId}`)) {
      //user folder exists
      cb(null, `./uploads/mascotas/${userId}/${mascotaId}`);
    } else {
      //Creates a new folder from user id and pet id
      fs.mkdirSync(`./uploads/mascotas/${userId}/${mascotaId}`, {
        recursive: true,
      });
      cb(null, `./uploads/mascotas/${userId}/${mascotaId}`);
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { files: 4 },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      return cb(
        new Error(
          "Alguna de las imagenes no tiene un formato valido, los formatos admitidos son .png, .jpg, .jpeg"
        )
      );
    }
  },
});

const memStorage = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // no larger than 5mb
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      return cb(
        new Error(
          "Alguna de las imagenes no tiene un formato valido, los formatos admitidos son .png, .jpg, .jpeg"
        )
      );
    }
  },
});

const uploadMultipleImages = upload.array("mascota");

//to upload images to local folder
app.post("/upload/local/mascota", (req, res) => {
  uploadMultipleImages(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      //console.log(err);
      if (err.code === "LIMIT_FILE_COUNT") {
        return res.status(400).send({
          msg: "Solo se permiten hasta 4 fotos de tipo (.png, .jpg, .jpeg)",
        });
      }
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).send({
          msg: "Uno o más archivos excede el límte de peso (5mb)",
        });
      }
    } else if (err) {
      console.log(err.message);
      return res
        .status(400)
        .send({ msg: "Error desconocido", error: err.message });
    }

    if (!req.files.length || !req.files) {
      return res
        .status(400)
        .send({ msg: "Se requiere al menos 1 foto de la mascota. (max. 4)" });
    }

    res.status(200).send(req.files);
  });
});

//to upload images to cloud bucket
app.post("/upload/gbucket/mascota", (req, res) => {
  const uploader = memStorage.array("fotosMascota");
  uploader(req, res, function (err) {
    const mimeTypes = ["image/png", "image/jpg", "image/jpeg"];
    try {
      const urls = [];
      if (req.files.length) {
        if (err instanceof multer.MulterError) {
          //console.log(err);
          if (err.code === "LIMIT_FILE_COUNT") {
            return res.status(400).send({
              msg: "Solo se permiten hasta 4 fotos de tipo (.png, .jpg, .jpeg)",
            });
          }
          if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).send({
              msg: "Uno o más archivos excede el límte de peso (5mb)",
            });
          }
        }

        //reviso extension de todas las imagenes
        for (var i = 1; i <= req.files.length; i++) {
          if (!mimeTypes.includes(req.files[i - 1].mimetype)) {
            return res.status(400).send({
              msg: "Solo se permiten hasta 4 fotos de tipo (.png, .jpg, .jpeg)",
            });
          }
        }

        const { userId, mascotaId } = req.body;

        req.files.map((f) => {
          const uniqueSuffix =
            Date.now() + "-" + Math.round(Math.random() * 1e9);
          //
          const blob = bucket.file(
            `pets/pet_user_${userId}/pet_${mascotaId}/${uniqueSuffix}-${f.originalname}`
          );
          const blobStream = blob.createWriteStream();

          urls.push(
            `https://storage.cloud.google.com/find_my_pet_pets_images/pets/pet_user_${userId}/pet_${mascotaId}/${uniqueSuffix}-${f.originalname}`
          );
          blobStream.on("finish", () => {
            //console.log("Subido: ", f);
          });
          blobStream.end(f.buffer);
        });
        res.status(200).send({ msg: "Imagenes subidas correctamente.", urls });
      } else {
        res
          .status(400)
          .send({ msg: "Se requiere al menos 1 foto de la mascota. (max. 4)" });
      }
    } catch (error) {
      res.status(500).send({ msg: "Error inesperado", error });
    }
  });
});

app.post("/delete/gbucket/mascota/", (req, res) => {
  //elimnar objeto de bucket mediante url recibida en post
  const fotosEliminar = req.body;
  console.log("Se eliminan fotos: ", fotosEliminar);

  if (fotosEliminar.length) {
    fotosEliminar.map((url) => {
      let urlCorregido = url.split("/").slice(4).join("/");
      bucket.file(urlCorregido).delete();
    });

    res.status(200).send({ msg: "Fotos eliminadas exitosamente." });
  }

  res.status(200).send({});
});

app.post("/delete/all/mascota/", async (req, res) => {
  const { idmascota, idusuario } = req.body;
  const [files] = await bucket.getFiles({
    prefix: `pets/pet_user_${idusuario}/pet_${idmascota}`,
  });

  files.forEach((imagen) => {
    bucket.file(`${imagen.name}`).delete();
  });

  res.status(200).send({ msg: "Carpeta de fotos eliminada correctamente." });
});

app.post("/events", (req, res) => {
  const { type, payload } = req.body;
  console.log("Event received: ", type);

  if (type == "ELIMINA_FOTOS") {
    axios
      .post("http://api-uploader:4004/delete/gbucket/mascota/", payload)
      .catch((error) => console.log(error));
  } else if (type == "ELIMINA_CARPETA_FOTOS") {
    axios
      .post("http://api-uploader:4004/delete/all/mascota/", payload)
      .catch((error) => console.log(error));
  } else {
    res.status(200).send({});
  }
});

app.listen(4004, () => {
  console.log("Listening on port 4004");
});
