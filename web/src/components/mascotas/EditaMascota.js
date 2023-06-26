import React, { useEffect } from "react";
import {
  Button,
  Divider,
  Grid,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Pantalla from "../inicio/Pantalla";
import {
  getEspeciesAsync,
  getMascotaInfo,
  saveEditMascota,
  setInitialState,
} from "./../../redux/slices/mascotasSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import MascotaForm from "./MascotaForm";
import Titulo from "../common/Titulo";
import FotosMascota from "./FotosMascota";

const EditaMascota = () => {
  const mascotaData = useSelector((state) => state.mascotas.mascotaData);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let params = useParams();

  useEffect(() => {
    if (params && params.mascotaId) {
      dispatch(getMascotaInfo(params.mascotaId));
      dispatch(getEspeciesAsync());
      return () => {
        dispatch(setInitialState());
      };
    }
  }, []);

  const handleSaveEdit = () => {
    if (dispatch(saveEditMascota())) {
      navigate("/mascotas");
    }
  };

  return (
    <Pantalla>
      <Grid container spacing={2} sx={{ p: 4 }}>
        <Grid item xs={12} md={12}>
          <Titulo label="Acerca de tu Mascota" />
        </Grid>
        <Grid item xs={12} md={12}>
          <MascotaForm preload={true} />
        </Grid>
        <Grid item xs={12} md={12}>
          <FotosMascota />
        </Grid>
        <Grid item xs={12} md={12} sx={{ mb: 8 }}>
          <Button
            sx={{ mr: 2 }}
            onClick={() => navigate("/mascotas")}
            variant="outlined"
            color="primary"
            startIcon={<ArrowBackIosIcon />}
          >
            Regresar
          </Button>
          <Button
            onClick={handleSaveEdit}
            variant="outlined"
            color="primary"
            startIcon={<SaveIcon />}
          >
            Guardar cambios
          </Button>
        </Grid>
      </Grid>
    </Pantalla>
  );
};

export default EditaMascota;
