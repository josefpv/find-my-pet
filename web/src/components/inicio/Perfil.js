import React, { useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import Avatar from "@mui/material/Avatar";
import LogoutIcon from "@mui/icons-material/Logout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { cerrarSesion } from "../../redux/slices/sesionSlice";

const Perfil = () => {
  const navigate = useNavigate();
  const infoUsuario = useSelector((state) => state.sesion.infoUsuario);
  const token = useSelector((state) => state.sesion.token);
  const dispatch = useDispatch();
  /* 
  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token]); */

  const handleCierraSesion = () => {
    dispatch(cerrarSesion());
  };

  return (
    <Grid
      container
      spacing={4}
      justifyContent="center"
      alignContent="center"
      sx={{ bgcolor: "#006472", height: "100vh" }}
    >
      <Grid sx={{ textAlign: "center" }}>
        <Box sx={{ width: 200, height: 200 }}>
          <Avatar
            sx={{
              width: "100%",
              height: "100%",
              fontSize: 100,
              bgcolor: "#ffffff",
              color: "#006472",
            }}
          >
            JP
          </Avatar>
        </Box>
      </Grid>
      <Grid md={12} xs={12} sx={{ textAlign: "center" }}>
        <Typography variant="h4" component="div" sx={{ color: "#ffffff" }}>
          {`${infoUsuario.nombre} ${infoUsuario.apellido}`}
        </Typography>
        <Typography
          variant="caption"
          component="div"
          sx={{ color: "#ffffff", mb: 4 }}
        >
          {`${infoUsuario.email}`}
        </Typography>
        <Button
          color="secondary"
          variant="contained"
          startIcon={<LogoutIcon />}
          onClick={handleCierraSesion}
        >
          Cerrar Sesión
        </Button>
      </Grid>
    </Grid>
  );
};

export default Perfil;
