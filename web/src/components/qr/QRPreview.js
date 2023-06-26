import React, { useEffect, useState } from "react";
import { Button, Divider, Grid, IconButton, Typography } from "@mui/material";
import QRCode from "react-qr-code";
import { useParams } from "react-router-dom";

const QRPreview = () => {
  const [serial, setSerial] = useState("");
  let params = useParams();

  useEffect(() => {
    if (params && params.serial) {
      setSerial(params.serial);
    }
  }, []);
  return (
    <Grid container>
      <Grid item xs={12} md={12}>
        <Grid container justifyContent="center">
          <Grid item md={6} xs={12} sx={{ p: 4 }}>
            <QRCode
              size={100}
              style={{ height: "auto", maxWidth: "80%", width: "80%" }}
              value={`http://localhost:3000/mascotas/perfil/${serial}`}
              viewBox={`0 0 100 100`}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default QRPreview;
