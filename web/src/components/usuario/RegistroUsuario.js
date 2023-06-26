import React, { useEffect } from "react";
import { Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import UsuarioForm from "./UsuarioForm";
import Titulo from "./../common/Titulo";
import { useDispatch, useSelector } from "react-redux";
import {
  registraUsuario,
  setInitialState,
} from "../../redux/slices/sesionSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const RegistroUsuario = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const infoUsuario = useSelector((state) => state.sesion.infoUsuario);

  useEffect(() => {
    return () => {
      dispatch(setInitialState());
    };
  }, []);

  const handleRegistroUsuario = () => {
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

    if (password !== repite_password) {
      return toast.error("Las contraseñas no coinciden.");
    }

    if (dispatch(registraUsuario())) {
      toast.success("Registro exitoso, ya puedes iniciar sesión...");
      navigate("/");
    } else {
      toast.error(
        "No se ha podido completar el registro, por favor intenta nuevamente"
      );
    }
  };

  return (
    <Grid2 container sx={{ p: 4 }}>
      <Grid2 md={12}>
        <Titulo label="Crea una cuenta para ti" />
      </Grid2>
      <Grid2 md={12} sx={{ mt: 2 }}>
        <Typography>
          Bienvenido, estás a un paso de formar parte de FindMyPet, completa el
          formulario para que puedas ingresar al sistema.
        </Typography>
      </Grid2>
      <Grid2 md={12} sx={{ mt: 8 }}>
        <UsuarioForm onSubmit={handleRegistroUsuario} />
      </Grid2>
    </Grid2>
  );
};

export default RegistroUsuario;
