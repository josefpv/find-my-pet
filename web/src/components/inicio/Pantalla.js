import React, { useEffect } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import Menu from "./Menu";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import MenuAdmin from "./MenuAdmin";

const Pantalla = ({ children }) => {
  const navigate = useNavigate();
  const infoUsuario = useSelector((state) => state.sesion.infoUsuario);
  const token = useSelector((state) => state.sesion.token);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token]);

  return (
    <Grid sx={{ height: "100vh" }}>
      {children}
      {infoUsuario.cliente ? <Menu /> : <MenuAdmin />}
    </Grid>
  );
};

export default Pantalla;
