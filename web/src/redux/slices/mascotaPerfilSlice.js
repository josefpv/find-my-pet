import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import config from "./../../config.json";
import { toast } from "react-toastify";
import http from "./../../services/http";

const initialState = {
  mascotaInfo: {},
  urlImagenes: [],
};

export const mascotaPerfilSlice = createSlice({
  name: "mascotaPerfil",
  initialState: {
    mascotaInfo: {},
    urlImagenes: [],
  },
  reducers: {
    setMascotaInfo: (state, action) => {
      state.mascotaInfo = action.payload;
    },
    setMascotaURLImagenes: (state, action) => {
      state.urlImagenes = action.payload;
    },
  },
});

export const getMascotaInfoBySerial =
  (serial) => async (dispatch, getState) => {
    const { dominio, puerto, url } = config.endpoints.buscaMascotaBySerial;
    const urlApi = `${dominio}${url}${serial}`;

    const response = await http.get(urlApi);
    if (response.status == 200) {
      dispatch(setMascotaInfo(response.data.infoMascota));
      dispatch(setMascotaURLImagenes(response.data.urlImagenes));
    } else {
      toast.error("No hay mascota asociada a QR");
    }
  };

export const { setMascotaInfo, setMascotaURLImagenes } =
  mascotaPerfilSlice.actions;
export default mascotaPerfilSlice.reducer;
