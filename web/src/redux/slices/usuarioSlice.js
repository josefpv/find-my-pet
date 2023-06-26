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
  usuarios: [],
};

export const usuarioSlice = createSlice({
  name: "usuario",
  initialState: {
    usuarios: [],
  },
  reducers: {
    setUsuarios: (state, action) => {
      state.usuarios = action.payload;
    },
    setInitialState: () => initialState,
  },
});

export const obtieneClientes = () => async (dispatch) => {
  const { dominio, puerto, url } = config.endpoints.obtieneClientes;
  const urlApi = `${dominio}${url}`;
  const response = await http.get(urlApi);

  if (response.status == 200) {
    //redirecciona a inicio de sesion
    dispatch(setUsuarios(response.data.clientes));
  } else {
    dispatch(setUsuarios([]));
    toast.error(
      "Error al intentar obtener los clientes, por favor intente nuevamente"
    );
  }
};

export const resetUsuarios = () => (dispatch) => {
  dispatch(setInitialState());
};

export const { setUsuarios, setInitialState } = usuarioSlice.actions;

export default usuarioSlice.reducer;
