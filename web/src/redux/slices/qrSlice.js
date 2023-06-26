import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import config from "./../../config.json";
import http from "../../services/http";
import { toast } from "react-toastify";

const initialState = {
  qrs: [],
  qrSerialCreado: "",
};

export const qrSlice = createSlice({
  name: "qr",
  initialState: {
    qrs: [],
    qrSerialCreado: "",
  },
  reducers: {
    setQrs: (state, action) => {
      state.qrs = action.payload;
    },
    setQrSerialCreado: (state, action) => {
      state.qrSerialCreado = action.payload;
    },
    setInitialState: () => initialState,
  },
});

export const obtieneQrs = () => async (dispatch) => {
  const { dominio, puerto, url } = config.endpoints.obtieneQrs;
  const urlApi = `${dominio}${url}`;
  const response = await http.get(urlApi);

  if (response.status == 200) {
    dispatch(setQrs(response.data));
  } else {
    dispatch(setQrs([]));
    toast.error("Ha ocurrido un error al intentar cargar los QRs");
  }
};

export const nuevoQR = () => async (dispatch) => {
  const { dominio, puerto, url } = config.endpoints.nuevoQR;
  const urlApi = `${dominio}${url}`;
  const response = await http.post(urlApi);

  if (response.status == 200) {
    toast.success("Se ha creado nuevo QR");
    dispatch(obtieneQrs());
    dispatch(setQrSerialCreado(response.data.result));
  } else {
    dispatch(setQrs([]));
    toast.error("Ha ocurrido un error al intentar crear el nuevo QR");
  }
};

export const validaQR = async (serial, clave) => {
  let valido = false;
  const { dominio, puerto, url } = config.endpoints.validaQR;
  const urlApi = `${dominio}${url}`;
  try {
    const res = await http.post(urlApi, { serial, clave });
    if (res.data.valido) {
      valido = true;
    }
  } catch (err) {
    if (err.response) {
      console.log(err.response.status);
      console.log(err.response.statusText);
      console.log(err.message);
      console.log(err.response.headers);
      console.log(err.response.data);
    } else {
      console.log(err);
    }
  }

  return valido;
};

export const toggleEstado = (estado, id) => async (dispatch) => {
  const { dominio, puerto, url } = config.endpoints.toggleQREstado;
  const urlApi = `${dominio}${url}`;
  try {
    const res = await http.put(urlApi, { estado, id });

    if (res.status == 200) {
      toast.success(`QR ${estado ? "activado" : "desactivado"} exitosamente.`);
      dispatch(obtieneQrs());
    } else {
      toast.error(
        `Error al intentar ${estado ? "activar" : "desactivar"} el QR.`
      );
    }
  } catch (err) {
    if (err.response) {
      console.log(err.response.status);
      console.log(err.response.statusText);
      console.log(err.message);
      console.log(err.response.headers);
      console.log(err.response.data);
    } else {
      console.log(err);
    }
  }
};

export const reset = () => (dispatch) => {
  dispatch(setInitialState());
};

export const { setInitialState, setQrs, setQrSerialCreado } = qrSlice.actions;
export default qrSlice.reducer;
