import React, { useEffect } from "react";
import {
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
import { useDispatch, useSelector } from "react-redux";
import {
  setDataMascota,
  getEspeciesAsync,
  getRazaByEspecieAsync,
  getMascotaInfo,
} from "./../../redux/slices/mascotasSlice";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import { useParams } from "react-router-dom";

const MascotaForm = ({ preload = false }) => {
  const especiesLista = useSelector((state) => state.mascotas.especiesLista);
  const razaLista = useSelector((state) => state.mascotas.razasLista);
  const mascotaData = useSelector((state) => state.mascotas.mascotaData);
  const dispatch = useDispatch();
  let params = useParams();

  useEffect(() => {
    if (!preload) {
      dispatch(getEspeciesAsync());
    }
  }, []);

  useEffect(() => {
    if (!preload) {
      if (mascotaData.especie !== "") {
        dispatch(getRazaByEspecieAsync(mascotaData.especie));
      }
    }
  }, [mascotaData.especie]);

  const handleChangeEspecie = (especieId) => {
    dispatch(setDataMascota({ field: "especie", value: especieId }));
  };

  const handleChangeRaza = (razaId) => {
    dispatch(setDataMascota({ field: "raza", value: razaId }));
  };

  return (
    <Grid container spacing={2} sx={{ pt: 2 }}>
      <Grid item xs={12} md={4}>
        <TextField
          id="nombre"
          label="Nombre de tu mascota"
          variant="outlined"
          color="primary"
          fullWidth
          disabled={preload}
          value={mascotaData.nombre}
          onChange={(e) =>
            dispatch(setDataMascota({ field: "nombre", value: e.target.value }))
          }
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          id="descripcion"
          label="Descripcion"
          variant="outlined"
          color="primary"
          fullWidth
          value={mascotaData.descripcion}
          onChange={(e) =>
            dispatch(
              setDataMascota({ field: "descripcion", value: e.target.value })
            )
          }
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          id="tamaño"
          label="Tamaño aprox."
          variant="outlined"
          color="primary"
          helperText="Pequeño, mediano, grande..."
          fullWidth
          value={mascotaData.tamano}
          onChange={(e) =>
            dispatch(setDataMascota({ field: "tamano", value: e.target.value }))
          }
        />
      </Grid>
      <Grid item xs={6} md={4}>
        <TextField
          id="color1"
          label="Color principal"
          variant="outlined"
          color="primary"
          fullWidth
          value={mascotaData.color1}
          onChange={(e) =>
            dispatch(setDataMascota({ field: "color1", value: e.target.value }))
          }
          type="color"
        />
      </Grid>
      <Grid item xs={6} md={4}>
        <TextField
          id="color2"
          label="Color secundario"
          variant="outlined"
          color="primary"
          fullWidth
          value={mascotaData.color2}
          onChange={(e) =>
            dispatch(setDataMascota({ field: "color2", value: e.target.value }))
          }
          type="color"
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <FormControl fullWidth>
          <InputLabel id="select-especie-label">Especie</InputLabel>
          <Select
            disabled={preload}
            labelId="select-especie-label"
            id="select-especie"
            value={mascotaData.especie}
            label="Especie"
            onChange={(e) => handleChangeEspecie(e.target.value)}
          >
            {especiesLista &&
              especiesLista.map((especie) => (
                <MenuItem value={especie.id} key={especie.id}>
                  {especie.nombre}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </Grid>
      {razaLista.length ? (
        <Grid item xs={12} md={4}>
          {
            <FormControl fullWidth>
              <InputLabel id="select-raza-label">Raza</InputLabel>
              <Select
                labelId="select-raza-label"
                id="select-raza"
                value={mascotaData.raza}
                label="Raza"
                onChange={(e) => handleChangeRaza(e.target.value)}
              >
                {razaLista.map((raza) => (
                  <MenuItem value={raza.id} key={raza.id}>
                    {raza.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          }
        </Grid>
      ) : null}
      <Grid item xs={12} md={4}>
        <TextField
          id="nombre-alterno"
          label="También responde a"
          variant="outlined"
          color="primary"
          fullWidth
          helperText="Nombre alternativo"
          value={mascotaData.nombre_alterno}
          onChange={(e) =>
            dispatch(
              setDataMascota({ field: "nombre_alterno", value: e.target.value })
            )
          }
          disabled={preload}
        />
        <Grid item xs={12} md={12} sx={{ mt: 2 }}>
          <Divider>Género</Divider>
        </Grid>
        <Grid item xs={12} md={12} sx={{ pt: 2, pb: 4, textAlign: "center" }}>
          <ToggleButtonGroup
            disabled={preload}
            value={mascotaData.genero}
            exclusive
            onChange={(e, newGenero) =>
              newGenero !== null &&
              dispatch(setDataMascota({ field: "genero", value: newGenero }))
            }
          >
            <ToggleButton value={1}>
              <MaleIcon /> Macho
            </ToggleButton>
            <ToggleButton value={2}>
              <FemaleIcon /> Hembra
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default MascotaForm;
