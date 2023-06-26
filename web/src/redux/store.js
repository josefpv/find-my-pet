import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import menuReducer from "./slices/menuSlice";
import mascotasReducer from "./slices/mascotasSlice";
import mascotaPerfilReducer from "./slices/mascotaPerfilSlice";
import qrReducer from "./slices/qrSlice";
import sesionReducer from "./slices/sesionSlice";
import usuariosReducer from "./slices/usuarioSlice";

export default configureStore({
  reducer: {
    sesion: sesionReducer,
    menu: menuReducer,
    mascotas: mascotasReducer,
    mascotaPerfil: mascotaPerfilReducer,
    qr: qrReducer,
    usuarios: usuariosReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
