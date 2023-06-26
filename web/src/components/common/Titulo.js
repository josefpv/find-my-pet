import React from "react";
import Pantalla from "../inicio/Pantalla";
import { Box, Divider, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";

const Titulo = ({ label }) => {
  return (
    <Grid md={12}>
      <Typography variant="h4" sx={{ width: "100%", color: "#006472" }}>
        {label.toUpperCase()}
      </Typography>
      <Divider light sx={{ width: "100%" }} />
    </Grid>
  );
};

export default Titulo;
