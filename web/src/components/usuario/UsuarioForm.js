import React, { useEffect } from "react";
import {
  Box,
  Button,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { useDispatch, useSelector } from "react-redux";
import {
  obtieneComunas,
  obtieneRegiones,
  registraUsuario,
  setInfoUsuarioForm,
  verificaEmail,
} from "../../redux/slices/sesionSlice";
import { toast } from "react-toastify";

const UsuarioForm = ({ onSubmit, origen = "nuevo" }) => {
  const dispatch = useDispatch();

  const regiones = useSelector((state) => state.sesion.regiones);
  const comunas = useSelector((state) => state.sesion.comunas);
  const infoUsuario = useSelector((state) => state.sesion.infoUsuario);
  const emailValido = useSelector((state) => state.sesion.emailDisponible);

  useEffect(() => {
    dispatch(obtieneRegiones());
  }, []);

  useEffect(() => {
    dispatch(obtieneComunas());
  }, [infoUsuario.region_id]);

  useEffect(() => {
    dispatch(verificaEmail());
  }, [infoUsuario.email]);

  const helperTextEmail = () => {
    if (infoUsuario.email) {
      if (emailValido) {
        return "Email está disponible para registro.";
      } else {
        return "El email no es válido para registro o ya está en uso.";
      }
    }

    return "Ingrese un email para verificar disponibilidad.";
  };

  return (
    <Grid2 container spacing={2}>
      <Grid2 md={4} xs={12}>
        <TextField
          id="nombre"
          label="Nombres"
          variant="outlined"
          color="primary"
          fullWidth
          value={infoUsuario.nombre}
          onChange={(e) =>
            dispatch(
              setInfoUsuarioForm({
                field: "nombre",
                value: e.target.value,
              })
            )
          }
        />
      </Grid2>
      <Grid2 md={4} xs={12}>
        <TextField
          id="apellido"
          label="Apellidos"
          variant="outlined"
          color="primary"
          fullWidth
          value={infoUsuario.apellido}
          onChange={(e) =>
            dispatch(
              setInfoUsuarioForm({
                field: "apellido",
                value: e.target.value,
              })
            )
          }
        />
      </Grid2>
      <Grid2 md={4} xs={12}>
        <TextField
          id="email"
          label="Email"
          variant="outlined"
          color="primary"
          fullWidth
          value={infoUsuario.email}
          onChange={(e) =>
            dispatch(
              setInfoUsuarioForm({
                field: "email",
                value: e.target.value,
              })
            )
          }
          helperText={
            origen == "actualiza"
              ? "Por seguridad el email no puede ser cambiado"
              : helperTextEmail()
          }
          disabled={origen == "actualiza"}
        />
      </Grid2>
      <Grid2 md={4} xs={12}>
        <TextField
          id="password"
          label="Password"
          variant="outlined"
          color="primary"
          fullWidth
          value={infoUsuario.password}
          onChange={(e) =>
            dispatch(
              setInfoUsuarioForm({
                field: "password",
                value: e.target.value,
              })
            )
          }
          type="password"
          helperText={
            origen == "actualiza" &&
            "Ingrese nueva contraseña si desea cambiarla"
          }
        />
      </Grid2>
      <Grid2 md={4} xs={12}>
        <TextField
          id="repite_password"
          label="Repetir Password"
          variant="outlined"
          color="primary"
          fullWidth
          value={infoUsuario.repite_password}
          onChange={(e) =>
            dispatch(
              setInfoUsuarioForm({
                field: "repite_password",
                value: e.target.value,
              })
            )
          }
          type="password"
          helperText={
            origen == "actualiza" &&
            "Repita la nueva contraseña si desea cambiarla"
          }
        />
      </Grid2>
      <Grid2 md={4} xs={12}>
        <TextField
          id="telefono"
          label="Teléfono"
          variant="outlined"
          color="primary"
          fullWidth
          value={infoUsuario.telefono}
          onChange={(e) =>
            dispatch(
              setInfoUsuarioForm({
                field: "telefono",
                value: e.target.value,
              })
            )
          }
        />
      </Grid2>
      <Grid2 md={4} xs={12}>
        <FormControl fullWidth>
          <InputLabel id="select-region">Región</InputLabel>
          <Select
            labelId="select-region-label"
            id="select-region"
            label="Región"
            value={infoUsuario.region_id}
            onChange={(e) =>
              dispatch(
                setInfoUsuarioForm({
                  field: "region_id",
                  value: e.target.value,
                })
              )
            }
          >
            {regiones &&
              regiones.map((region) => (
                <MenuItem value={region.id} key={region.id}>
                  {region.nombre}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </Grid2>
      <Grid2 md={4} xs={12}>
        <FormControl fullWidth>
          <InputLabel id="select-comuna">Comuna</InputLabel>
          <Select
            labelId="select-comuna-label"
            id="select-comuna"
            label="Comuna"
            value={infoUsuario.comuna_id}
            onChange={(e) =>
              dispatch(
                setInfoUsuarioForm({
                  field: "comuna_id",
                  value: e.target.value,
                })
              )
            }
          >
            {comunas &&
              comunas.map((comuna) => (
                <MenuItem value={comuna.id} key={comuna.id}>
                  {comuna.nombre}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </Grid2>
      <Grid2 md={4} xs={12}>
        <TextField
          id="direccion"
          label="Dirección"
          variant="outlined"
          color="primary"
          fullWidth
          value={infoUsuario.direccion}
          onChange={(e) =>
            dispatch(
              setInfoUsuarioForm({
                field: "direccion",
                value: e.target.value,
              })
            )
          }
        />
      </Grid2>
      <Grid2 md={4} xs={12}>
        {origen == "nuevo" ? (
          <Button
            onClick={onSubmit}
            variant="outlined"
            color="primary"
            disabled={!emailValido}
            startIcon={<CheckIcon />}
          >
            Crear cuenta
          </Button>
        ) : (
          <Button
            onClick={onSubmit}
            variant="outlined"
            color="primary"
            disabled={origen == "actualiza" ? false : !emailValido}
            startIcon={<CheckIcon />}
          >
            Actualizar
          </Button>
        )}
      </Grid2>
    </Grid2>
  );
};

export default UsuarioForm;
