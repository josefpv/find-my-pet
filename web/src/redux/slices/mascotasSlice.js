import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import http from "../../services/http";
import config from "./../../config.json";
import { toast } from "react-toastify";

const initialState = {
  qrData: {
    serial: "",
    clave: "",
  },
  mascotaData: {
    nombre: "",
    descripcion: "",
    tamano: "",
    color1: "",
    color2: "",
    especie: "",
    raza: "",
    genero: 1,
    nombre_alterno: "",
    fechaNacimiento: "",
  },
  fotosEliminadas: [],
  fotosDT: new DataTransfer(),
  especiesLista: [],
  razasLista: [],
  mascotaRegistrada: false,
  mascotasLista: [],
};

export const mascotasSlice = createSlice({
  name: "mascotas",
  initialState: {
    qrData: {
      serial: "",
      clave: "",
    },
    mascotaData: {
      nombre: "",
      descripcion: "",
      tamano: "",
      color1: "",
      color2: "",
      especie: "",
      raza: 1,
      genero: 1,
      nombre_alterno: "",
      fecha_nacimiento: "",
      fotosUrl: [],
    },
    fotosEliminadas: [],
    fotosDT: new DataTransfer(),
    especiesLista: [],
    razasLista: [],
    mascotaRegistrada: false,
    mascotasLista: [],
  },
  reducers: {
    setDataQR: (state, action) => {
      state.qrData[action.payload.field] = action.payload.value;
    },
    setDataMascota: (state, action) => {
      state.mascotaData[action.payload.field] = action.payload.value;
    },
    setEspeciesLista: (state, action) => {
      state.especiesLista = action.payload;
    },
    setRazasLista: (state, action) => {
      state.razasLista = action.payload;
    },
    setMascotaRegistrada: (state, action) => {
      state.mascotaRegistrada = action.payload;
    },
    setMascotasLista: (state, action) => {
      state.mascotasLista = action.payload;
    },
    setFotosEliminadas: (state, action) => {
      state.fotosEliminadas = [...state.fotosEliminadas, action.payload];
    },
    setInitialState: () => initialState,
  },
});

export const getEspeciesAsync = () => (dispatch) => {
  const { dominio, puerto, url } = config.endpoints.obtieneEspecies;
  const urlApi = `${dominio}${url}`;
  axios
    .get(urlApi)
    .then((res) => {
      dispatch(setEspeciesLista(res.data));
    })
    .catch((err) => {
      if (err.response) {
        console.log(err.response.status);
        console.log(err.response.statusText);
        console.log(err.message);
        console.log(err.response.headers);
        console.log(err.response.data);
      } else {
        console.log(err);
      }
      dispatch(setEspeciesLista([]));
    });
};

export const getRazaByEspecieAsync =
  (especieId, selected = null) =>
  (dispatch, getState) => {
    console.log("ESPECIE ID: ", especieId);
    const { dominio, puerto, url } = config.endpoints.obtieneRazas;
    const urlApi = `${dominio}${url}${especieId}`;
    console.log(urlApi);
    axios
      .get(urlApi)
      .then((res) => {
        dispatch(setRazasLista(res.data));
        if (getState().mascotas.razasLista.length) {
          selected == null
            ? dispatch(
                setDataMascota({
                  field: "raza",
                  value: getState().mascotas.razasLista[0].id,
                })
              )
            : dispatch(
                setDataMascota({
                  field: "raza",
                  value: selected,
                })
              );
        }
      })
      .catch((err) => {
        if (err.response) {
          console.log(err.response.status);
          console.log(err.response.statusText);
          console.log(err.message);
          console.log(err.response.headers);
          console.log(err.response.data);
        } else {
          console.log(err);
        }
        dispatch(setRazasLista([]));
      });
  };

export const createMascotaAsync = () => async (dispatch, getState) => {
  const { mascotaData, qrData, fotosDT } = getState().mascotas;
  const { infoUsuario, token } = getState().sesion;

  console.log("Datos a guardar: ", mascotaData);
  console.log("QR: ", qrData);
  console.log("Fotos: ", fotosDT.files);

  const {
    nombre,
    descripcion,
    fechaNacimiento,
    tamano,
    color1: colorPrincipal,
    color2: colorSecundario,
    especie,
    genero,
    raza: razaId,
    nombre_alterno,
  } = mascotaData;

  const dataApi = {
    nombre,
    descripcion,
    fechaNacimiento,
    tamano,
    colorPrincipal,
    colorSecundario,
    especie,
    genero,
    razaId,
    propietarioId: infoUsuario.id,
    estadoId: 1,
    nombre_alterno,
    clave: qrData.clave,
    serial: qrData.serial,
  };

  console.log("Data API: ", dataApi);

  const { dominio, puerto, url } = config.endpoints.registraMascota;
  const urlApi = `${dominio}${url}`;

  //registra mascota en bd
  const response = await axios.post(urlApi, dataApi, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (response.status == 200) {
    const {
      dominio: dominioUploader,
      puerto: puertoUploader,
      url: urlUploader,
    } = config.endpoints.uploadFotoMascota;
    const urlApiUploader = `${dominioUploader}:${puertoUploader}${urlUploader}`;
    //sube fotos
    const { id: idMascota } = response.data;
    const formDataMacota = new FormData();

    formDataMacota.append("userId", infoUsuario.id);
    formDataMacota.append("mascotaId", idMascota);
    for (var i = 0; i <= fotosDT.files.length; i++) {
      formDataMacota.append("fotosMascota", fotosDT.files[i]);
    }

    axios
      .post(urlApiUploader, formDataMacota, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        //desactiva qr
        dispatch(setMascotaRegistrada(true));
      })
      .catch((err) => console.log(("ERROR GUARDA MASCOTA: ", err)));
  }
};

export const getMascotasPropietario = () => (dispatch, getState) => {
  const idPropietario = getState().sesion.infoUsuario.id;
  const { dominio, puerto, url } = config.endpoints.buscaMascotasPropietario;
  const urlApi = `${dominio}${url}${idPropietario}`;

  http
    .get(urlApi)
    .then((res) => {
      dispatch(setMascotasLista(res.data));
    })
    .catch((err) => {
      if (err.response) {
        console.log(err.response.status);
        console.log(err.response.statusText);
        console.log(err.message);
        console.log(err.response.headers);
        console.log(err.response.data);
      } else {
        console.log(err);
      }
      dispatch(setMascotasLista([]));
      //toast.error("No se han conseguido mascotas registradas.");
    });
};

export const getMascotaInfo = (idMascota) => (dispatch, getState) => {
  const token = getState().sesion.token;
  const { dominio, puerto, url } = config.endpoints.buscaMascotasId;
  const urlApi = `${dominio}${url}${idMascota}`;
  console.log("URL: ", urlApi);
  axios
    .get(urlApi, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => {
      Object.keys(res.data.infoMascota).forEach((field) => {
        console.log({ field, value: res.data.infoMascota[field] });
        dispatch(setDataMascota({ field, value: res.data.infoMascota[field] }));
      });
      dispatch(
        setDataMascota({ field: "fotosUrl", value: res.data.urlImagenes })
      );
    })
    .catch((err) => {
      if (err.response) {
        console.log(err.response.status);
        console.log(err.response.statusText);
        console.log(err.message);
        console.log(err.response.headers);
        console.log(err.response.data);
      } else {
        console.log(err);
      }
      toast.error("No se ha conseguido la mascota solicitda.");
    });
};

export const saveEditMascota = () => async (dispatch, getState) => {
  const { infoUsuario, token } = getState().sesion;
  const { mascotaData, fotosDT, fotosEliminadas } = getState().mascotas;
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
    fotosUrl,
  } = mascotaData;
  console.log("Datos a guardar: ", mascotaData);
  console.log("Fotos a guardar: ", fotosDT);
  console.log("Fotos a eliminar: ", fotosEliminadas);

  const dataApi = {
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
    estadoId: 1,
    propietario_id: infoUsuario.id,
    fotosUrl,
    fotosEliminadas,
  };

  console.log("Data API: ", dataApi);

  const { dominio, puerto, url } = config.endpoints.actualizaMascota;
  const urlApi = `${dominio}${url}`;
  console.log("URL API: ", urlApi);

  //registra mascota en bd
  const response = await axios.put(urlApi, dataApi, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (response.status == 200) {
    //se procede a actualizar las imagenes
    if (fotosDT.files.length) {
      const {
        dominio: dominioUploader,
        puerto: puertoUploader,
        url: urlUploader,
      } = config.endpoints.uploadFotoMascota;
      const urlApiUploader = `${dominioUploader}:${puertoUploader}${urlUploader}`;
      //sube fotos
      const idMascota = id;
      const formDataMacota = new FormData();

      formDataMacota.append("userId", infoUsuario.id);
      formDataMacota.append("mascotaId", idMascota);
      for (var i = 0; i <= fotosDT.files.length; i++) {
        formDataMacota.append("fotosMascota", fotosDT.files[i]);
      }

      axios
        .post(urlApiUploader, formDataMacota, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res) => {
          //desactiva qr
          toast.success("Se ha actualizado con exito tu mascota.");
          return true;
        })
        .catch((err) => console.log(("ERROR GUARDA MASCOTA: ", err)));
    } else {
      console.log("No se van a actualizar las fotos");
      toast.success("Se ha actualizado con exito tu mascota.");
      return true;
    }
  } else {
    toast.error(
      "Ha ocurrido un error al intentar actualizar los datos de tu mascota, por favor intenta nuevamente."
    );
  }
};

export const deleteMascota = (idMascota) => async (dispatch, getState) => {
  const { infoUsuario, token } = getState().sesion;

  const { dominio, puerto, url } = config.endpoints.eliminaMascota;
  const urlApi = `${dominio}${url}${infoUsuario.id}/${idMascota}`;
  console.log("URL API: ", urlApi);

  console.log("URL API: ", urlApi);

  const response = await axios.delete(urlApi, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (response.status == 200) {
    toast.success("Se ha eliminado la mascota correctamente.");
    dispatch(getMascotasPropietario());
  } else {
    toast.error(
      "Ha ocurrido un error al intentar eliminar la mascota, por favor intente nuevamente."
    );
  }
};

export const {
  setDataQR,
  setDataMascota,
  setEspeciesLista,
  setRazasLista,
  setMascotaRegistrada,
  setMascotasLista,
  setFotosEliminadas,
  setInitialState,
} = mascotasSlice.actions;
export default mascotasSlice.reducer;
