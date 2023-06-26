import React, { useEffect, useState } from "react";
import Pantalla from "../inicio/Pantalla";

import {
  Box,
  Button,
  Divider,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import Titulo from "../common/Titulo";
import TarjetaMascota from "./TarjetaMascota";
import TarjetaNuevaMascota from "./TarjetaNuevaMascota";
import { useDispatch, useSelector } from "react-redux";
import {
  setMascotasLista,
  getMascotasPropietario,
  deleteMascota,
} from "./../../redux/slices/mascotasSlice";

const Mascotas = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState(null);
  const dispatch = useDispatch();
  const mascotasLista = useSelector((state) => state.mascotas.mascotasLista);
  const token = useSelector((state) => state.sesion.token);

  useEffect(() => {
    dispatch(getMascotasPropietario());
  }, []);

  useEffect(() => {
    if (mascotaSeleccionada == null) {
      setIsOpen(false);
    }
  }, [mascotaSeleccionada]);

  const handleClickOpen = (mascota) => {
    setIsOpen(true);
    setMascotaSeleccionada(mascota);
  };

  const handleClose = () => {
    setIsOpen(false);
    setMascotaSeleccionada(null);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteMascota(mascotaSeleccionada.id));
    setIsOpen(false);
  };

  return (
    <Pantalla>
      <Box sx={{ flex: 1 }}>
        <Grid container spacing={4} sx={{ p: 4 }}>
          <Dialog
            open={isOpen}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {`¿Está seguro que desea eliminar a ${
                mascotaSeleccionada && mascotaSeleccionada.nombre
              } ? 💔😔`}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Tus mascotas están asociadas a un código QR por lo que al
                eliminar a uno de ellos también estarás eliminado el QR que
                usaste al momento de registrarlo. Realiza solo esta acción si
                estás completamente seguro que no necesitarás más tu código QR
                ya que esta acción no se puede revertir y por seguridad el QR
                quedará inutilizable para siempre, ¿estás seguro?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>No</Button>
              <Button onClick={handleConfirmDelete} autoFocus>
                Sí, eliminar
              </Button>
            </DialogActions>
          </Dialog>
          <Titulo label="Tus mascotas" />
          <Grid md={12} xs={12} sx={{ paddingBottom: 8 }}>
            <Grid container spacing={4} justifyContent="center">
              {mascotasLista.mascotas &&
                mascotasLista.mascotas.length > 0 &&
                mascotasLista.mascotas.map((mascota) => (
                  <Grid md={4} key={mascota.id}>
                    <TarjetaMascota
                      mascota={mascota}
                      urlImagenes={mascotasLista.urlImagenes}
                      onDelete={handleClickOpen}
                    />
                  </Grid>
                ))}
              <Grid md={4}>
                <TarjetaNuevaMascota />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Pantalla>
  );
};

export default Mascotas;
