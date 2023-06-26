import React, { useEffect } from "react";
import "./index.css";
import {
  createBrowserRouter,
  RouterProvider,
  useNavigate,
} from "react-router-dom";
import {
  ThemeProvider,
  createTheme,
  responsiveFontSizes,
} from "@mui/material/styles";
import { recuperaSesion } from "./redux/slices/sesionSlice";

import "react-toastify/dist/ReactToastify.css";
import Login from "./components/login/Login";
import Inicio from "./components/inicio/Inicio";
import Mascotas from "./components/mascotas/Mascotas";

import { useDispatch, useSelector } from "react-redux";
import PerfilMascota from "./components/mascotas/PerfilMascota";
import NuevaMascota from "./components/mascotas/NuevaMascota";
import EditaMascota from "./components/mascotas/EditaMascota";
import RegistroUsuario from "./components/usuario/RegistroUsuario";
import PerfilUsuario from "./components/usuario/PerfilUsuario";
import Generador from "./components/qr/Generador";
import QRPreview from "./components/qr/QRPreview";
import QR from "./components/qr/QR";
import Clientes from "./components/usuario/Clientes";

let theme = createTheme({
  components: {
    Select: {
      styleOverrides: {
        root: {
          color: "#f30f0f",
        },
      },
    },
  },
  palette: {
    type: "light",
    primary: {
      main: "#006472",
      light: "#f74c4c",
      dark: "#f74c4c",
    },
    neutro: {
      main: "#000000",
    },
    secondary: {
      main: "#f30f0f",
    },
    background: {
      paper: "#f5f5f5",
    },
    success: {
      main: "#2e7d32",
    },
    error: {
      main: "#ff9800",
    },
    warning: {
      main: "#f57f17",
    },
  },
});

theme = responsiveFontSizes(theme);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/inicio",
    element: <Inicio />,
  },
  {
    path: "/mascotas",
    element: <Mascotas />,
  },
  {
    path: "/mascotas/perfil/:serial",
    element: <PerfilMascota />,
  },
  {
    path: "/mascotas/nueva",
    element: <NuevaMascota />,
  },
  {
    path: "/mascota/edita/:mascotaId",
    element: <EditaMascota />,
  },
  {
    path: "/usuario/registro",
    element: <RegistroUsuario />,
  },
  {
    path: "/usuario/perfil",
    element: <PerfilUsuario />,
  },
  {
    path: "/qr/generar",
    element: <Generador />,
  },
  {
    path: "/qr/preview/:serial",
    element: <QRPreview />,
  },
  {
    path: "/qr/lista",
    element: <QR />,
  },
  {
    path: "/clientes",
    element: <Clientes />,
  },
]);

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(recuperaSesion());
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};

export default App;
