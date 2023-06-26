import React from "react";
import { Box, Divider, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import LoyaltyIcon from "@mui/icons-material/Loyalty";
import ErrorIcon from "@mui/icons-material/Error";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const bull = (
  <Box
    component="span"
    sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}
  >
    •
  </Box>
);

const FinalizaRegistro = () => {
  const dispatch = useDispatch();
  const mascotaRegistrada = useSelector(
    (state) => state.mascotas.mascotaRegistrada
  );
  const navigate = useNavigate();

  if (mascotaRegistrada) {
    return (
      <Grid container spacing={2} justifyContent="center">
        <Grid md={12} xs={12} sx={{ textAlign: "center" }}>
          <LoyaltyIcon color="primary" sx={{ fontSize: 120 }} />
          <Typography variant="h5">
            ¡Tu mascota se ha registrado y se ha activado el QR!
          </Typography>
          <Typography>
            Recuerda que la activación del QR no puede revertirse, además por
            seguridad, nunca compartas la clave de 8 dígitos. Find my pet nunca
            te contactará para solicitartela.
          </Typography>
        </Grid>
      </Grid>
    );
  } else {
    return (
      <Grid container spacing={2} justifyContent="center">
        <Grid md={12} xs={12} sx={{ textAlign: "center" }}>
          <ErrorIcon color="secondary" sx={{ fontSize: 120 }} />
          <Typography variant="h5">
            No se pudo registrar a tu mascota
          </Typography>
          <Typography>
            Lamentamos que no hayas podido registrar a tu mascota y activar tu
            QR, te recomendamos hacer los siguiente:
          </Typography>
          <Divider sx={{ pt: 2, mb: 2 }}></Divider>
          <Typography>
            {bull} Verifica el serial y clave que ingresaste para el QR,
            recuerda que mayúsculas y minúsculas importan.
          </Typography>
          <Typography>
            {bull} Comprueba que el QR no este siendo usado por otra persona,
            recurda que el serial y la clave no debes compartirla en ningún
            momento.
          </Typography>
          <Typography>
            {bull} Verifica que los datos de tu mascota estén correcto y que
            hayas llenado el formulario de manera correcta.
          </Typography>
          <Typography>
            {bull} Comprueba tu conexión a internet e intenta de nuevo, se pudo
            haber perdido al momento de registrar.
          </Typography>
        </Grid>
        <Divider sx={{ pt: 2, mb: 2 }}></Divider>
        <Typography>
          Si nada de eso funcionó, contacta a tu proveedor e informale el error
          o intenta en unos minutos más.
        </Typography>
      </Grid>
    );
  }
};

export default FinalizaRegistro;
