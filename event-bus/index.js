const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { randomBytes } = require("crypto");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

const events = [];

app.post("/events", (req, res) => {
  const event = req.body;
  events.push(event);

  console.log("EVENT RECEIVED: ", event);

  axios
    .post("http://api-mascotas:4000/events", event)
    .catch((error) => console.log("Mascotas error: ", error));
  axios
    .post("http://api-auth:4001/events", event)
    .catch((error) => console.log("Auth error: ", error));

  axios
    .post("http://api-qr:4003/events", event)
    .catch((error) => console.log("QR error: ", error));

  axios
    .post("http://api-uploader:4004/events", event)
    .catch((error) => console.log("Uploader error: ", error));
});

app.get("/events", (req, res) => {
  res.send(events);
});

app.listen(4002, () => {
  console.log("Event-bus => Listening on 4002");
});
