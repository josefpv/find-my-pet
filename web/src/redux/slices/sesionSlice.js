import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import config from "./../../config.json";
import Cookies from "universal-cookie";
import { redirect } from "react-router-dom";
import { toast } from "react-toastify";
import http from "../../services/http";
import _ from "lodash";

const cookies = new Cookies();

const initialState = {
  loginForm: {
    email: "",
    password: "",
  },
  isAuthenticated: false,
  token: "",
  infoUsuario: {
    id: null,
    nombre: "",
    apellido: "",
    password: "",
    repite_password: "",
    email: "",
    telefono: "",
    comuna_id: 1,
    region_id: 1,
    direccion: "",
    cliente: true,
  },
  emailDisponible: null,
  regiones: [],
  comunas: [],
};

export const sesionSlice = createSlice({
  name: "sesion",
  initialState: {
    loginForm: {
      email: "",
      password: "",
    },
    isAuthenticated: false,
    token: "",
    infoUsuario: {
      id: null,
      nombre: "",
      apellido: "",
      password: "",
      repite_password: "",
      email: "",
      telefono: "",
      comuna_id: 1,
      region_id: 1,
      direccion: "",
      cliente: true,
    },
    emailDisponible: null,
    regiones: [],
    comunas: [],
  },
  reducers: {
    setLoginForm: (state, action) => {
      state.loginForm[action.payload.field] = action.payload.value;
    },
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    setInfoUsuario: (state, action) => {
      state.infoUsuario = action.payload;
    },
    setInfoUsuarioForm: (state, action) => {
      state.infoUsuario[action.payload.field] = action.payload.value;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setRegiones: (state, action) => {
      state.regiones = action.payload;
    },
    setComunas: (state, action) => {
      state.comunas = action.payload;
    },
    setEmailDisponible: (state, action) => {
      state.emailDisponible = action.payload;
    },
    setInitialState: () => initialState,
  },
});

export const recuperaSesion = () => (dispatch) => {
  const token = window.localStorage.getItem("token");
  const userInfo = JSON.parse(window.localStorage.getItem("findMyPetUserInfo"));

  if (token && userInfo) {
    dispatch(setAuthenticated(true));
    dispatch(setInfoUsuario(userInfo));
    dispatch(setToken(token));
    http.setToken(token);
  }
};

export const iniciaSesionAsyn = () => (dispatch, getState) => {
  const { email, password } = getState().sesion.loginForm;
  //console.log({ email, password });
  const { dominio, puerto, url } = config.endpoints.sesion;
  const urlApi = `${dominio}${url}`;
  console.log(urlApi);

  axios
    .post(urlApi, { email, password })
    .then((res) => {
      console.log("SESION ACEPTADA: ", res);
      dispatch(setAuthenticated(true));
      dispatch(setInfoUsuario(res.data.infoUsuario));
      dispatch(setToken(res.data.token));
      //seteo token en cabecera
      http.setToken(res.data.token);
      //guardo local storage
      window.localStorage.setItem("token", res.data.token);
      window.localStorage.setItem(
        "findMyPetUserInfo",
        JSON.stringify(res.data.infoUsuario)
      );
    })
    .catch((err) => {
      toast.error("Usuario o contraseña inválida");
      if (err.response) {
        console.log(err.response.status);
        console.log(err.response.statusText);
        console.log(err.message);
        console.log(err.response.headers);
        console.log(err.response.data);
      } else {
        console.log(err);
      }
      dispatch(setInitialState());
    });
};

export const obtieneRegiones = () => async (dispatch) => {
  const { dominio, puerto, url } = config.endpoints.obtieneRegiones;
  const urlApi = `${dominio}${url}`;
  const response = await http.get(urlApi);

  if (response.status == 200) {
    dispatch(setRegiones(response.data));
  } else {
    toast.error("Error al intentar cargar las regiones.");
    dispatch(setRegiones([]));
  }
};

export const obtieneComunas = () => async (dispatch, getState) => {
  const { region_id: regionId, comuna_id } = getState().sesion.infoUsuario;
  let selectedComuna = 0;

  const { dominio, puerto, url } = config.endpoints.obtieneComunas;
  const urlApi = `${dominio}${url}${regionId}`;
  const response = await http.get(urlApi);

  console.log("Comuna del usuario: ", comuna_id);

  if (response.status == 200) {
    dispatch(setComunas(response.data));
    const cantComunas = response.data.length;

    console.log(
      "index de comuna encontrada: ",
      _.findIndex(response.data, { id: comuna_id })
    );

    if (_.findIndex(response.data, { id: comuna_id }) >= 0) {
      selectedComuna = comuna_id;
    } else {
      selectedComuna = response.data[cantComunas - cantComunas].id;
    }

    dispatch(setInfoUsuarioForm({ field: "comuna_id", value: selectedComuna }));
  } else {
    toast.error("Error al intentar cargar las comunas.");
    dispatch(setComunas([]));
  }
};

export const cerrarSesion = () => (dispatch) => {
  dispatch(setInitialState(initialState));
  window.localStorage.removeItem("token");
  window.localStorage.removeItem("findMyPetUserInfo");
};

export const verificaEmail = () => async (dispatch, getState) => {
  const { email } = getState().sesion.infoUsuario;
  let emailValido = false;

  emailValido = String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );

  if (emailValido) {
    try {
      const { dominio, puerto, url } = config.endpoints.verificaEmail;
      const urlApi = `${dominio}${url}`;
      const response = await http.post(urlApi, { email });
      console.log(response);
      console.log(urlApi);

      if (response.status == 200) {
        return dispatch(setEmailDisponible(response.data.msg));
      }
    } catch (error) {
      return dispatch(setEmailDisponible(false));
    }
  }

  return dispatch(setEmailDisponible(emailValido));
};

export const validaSesion = () => {
  const infoUsuario = cookies.get("infoUsuario");
  console.log(JSON.parse(JSON.stringify(infoUsuario)));
};

export const registraUsuario = () => async (dispatch, getState) => {
  const {
    nombre,
    apellido,
    password,
    email,
    telefono,
    comuna_id,
    region_id,
    direccion,
  } = getState().sesion.infoUsuario;
  const dataApi = {
    nombre,
    apellido,
    password,
    email,
    telefono,
    comunaId: comuna_id,
    regionId: region_id,
    direccion,
  };

  const { dominio, puerto, url } = config.endpoints.registraUsuario;
  const urlApi = `${dominio}${url}`;
  const response = await http.post(urlApi, dataApi);

  if (response.status == 200) {
    //redirecciona a inicio de sesion
    return true;
  } else {
    toast.error("Error al registrar, por favor intente nuevamente");
  }
};

export const actualizaUsuario = () => async (dispatch, getState) => {
  const {
    id,
    nombre,
    apellido,
    password,
    email,
    telefono,
    comuna_id,
    region_id,
    direccion,
  } = getState().sesion.infoUsuario;
  const dataApi = {
    id,
    nombre,
    apellido,
    password,
    email,
    telefono,
    comunaId: comuna_id,
    regionId: region_id,
    direccion,
  };

  const { dominio, puerto, url } = config.endpoints.actualizaUsuario;
  const urlApi = `${dominio}${url}`;
  const response = await http.put(urlApi, dataApi);

  if (response.status == 200) {
    //redirecciona a inicio de sesion
    dispatch(cerrarSesion());
    toast.success(
      "Datos actualizados correctamente, por seguridad, por favor inicie sesión nuevamente."
    );
  } else {
    toast.error("Error al registrar, por favor intente nuevamente");
  }
};

export const {
  setLoginForm,
  setAuthenticated,
  setInfoUsuario,
  setInfoUsuarioForm,
  setRegiones,
  setEmailDisponible,
  setComunas,
  setToken,
  setInitialState,
} = sesionSlice.actions;
export default sesionSlice.reducer;
