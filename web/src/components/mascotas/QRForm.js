import { Grid, TextField, Typography } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setDataQR } from "./../../redux/slices/mascotasSlice";

const QRForm = () => {
  const qrData = useSelector((state) => state.mascotas.qrData);

  const dispatch = useDispatch();

  return (
    <Grid container spacing={2} sx={{ pt: 2 }}>
      <Grid item xs={12} md={12}>
        <TextField
          id="serial-qr"
          label="Serial"
          variant="outlined"
          color="primary"
          helperText="Considera mayúclas y minúsculas"
          fullWidth
          value={qrData.serial}
          onChange={(e) =>
            dispatch(setDataQR({ field: "serial", value: e.target.value }))
          }
        />
      </Grid>
      <Grid item xs={12} md={12}>
        <TextField
          id="clave-qr"
          label="Clave de 8 dígitos"
          variant="outlined"
          color="primary"
          type="password"
          helperText="¡Recuerda no compartir la clave!"
          fullWidth
          value={qrData.clave}
          onChange={(e) =>
            dispatch(setDataQR({ field: "clave", value: e.target.value }))
          }
        />
      </Grid>
    </Grid>
  );
};

export default QRForm;
