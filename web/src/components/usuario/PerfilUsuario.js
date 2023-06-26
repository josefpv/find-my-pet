import React, { useEffect } from "react";
import { Box, Grid, Typography } from "@mui/material";
import Pantalla from "../inicio/Pantalla";
import UsuarioForm from "./UsuarioForm";
import Titulo from "../common/Titulo";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  actualizaUsuario,
  recuperaSesion,
  registraUsuario,
  setInitialState,
} from "../../redux/slices/sesionSlice";
import { toast } from "react-toastify";

const PerfilUsuario = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const infoUsuario = useSelector((state) => state.sesion.infoUsuario);

  useEffect(() => {
    return () => {
      dispatch(recuperaSesion());
    };
  }, []);

  const handleActualizaUsuario = () => {
    let formularioValido = [];
    const {
      nombre,
      apellido,
      email,
      password,
      repite_password,
      telefono,
      direccion,
    } = infoUsuario;
    const formFields = {
      nombre,
      apellido,
      email,
      password,
      repite_password,
      telefono,
      direccion,
    };

    Object.keys(formFields).forEach((campo) => {
      formularioValido.push(formFields[campo] !== "");
    });

    if (formularioValido.includes(false)) {
      return toast.error("Debe completar el formulario para registrarse.");
    }

    if (password != "") {
      if (password !== repite_password) {
        return toast.error("Las contraseñas no coinciden.");
      }
    }

    dispatch(actualizaUsuario());
  };

  return (
    <Pantalla>
      <Grid container spacing={4} sx={{ p: 4 }}>
        <Grid item xs={12} md={12} sx={{ mb: 4 }}>
          <Titulo label="Tu Perfil" />
        </Grid>
        <Grid md={12} xs={12} sx={{ paddingBottom: 8, p: 4 }}>
          <UsuarioForm onSubmit={handleActualizaUsuario} origen="actualiza" />
        </Grid>
      </Grid>
    </Pantalla>
  );
};

export default PerfilUsuario;
