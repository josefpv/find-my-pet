import React, { useEffect } from "react";
import { Box, Button, Divider, TextField, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import Logo from "./../images/logo.png";
import InstagramIcon from "@mui/icons-material/Instagram";
import { Link, redirect, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { iniciaSesionAsyn, setLoginForm } from "../../redux/slices/sesionSlice";

const Login = () => {
  const navigate = useNavigate();
  const loginForm = useSelector((state) => state.sesion.loginForm);
  const token = useSelector((state) => state.sesion.token);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("Cambio token: ", token);
    if (token) {
      navigate("/inicio");
    }
  }, [token]);

  return (
    <Grid2 container justifyContent="center">
      <Grid2
        md={4}
        sx={{
          mt: 10,
          borderStyle: "solid",
          borderWidth: 0.5,
          borderColor: "#006472",
          borderRadius: 4,
          p: 4,
          textAlign: "center",
        }}
      >
        <img src={Logo} width={200} />
        <Typography sx={{ color: "#006472" }}>BIENVENIDO</Typography>
        <Box sx={{ width: "100%", mt: 4 }}>
          <TextField
            id="username"
            label="Usuario"
            variant="outlined"
            color="primary"
            focused
            fullWidth
            value={loginForm.email}
            onChange={(e) =>
              dispatch(setLoginForm({ field: "email", value: e.target.value }))
            }
          />
        </Box>
        <Box sx={{ width: "100%", mt: 4 }}>
          <TextField
            id="password"
            label="Password"
            variant="outlined"
            color="primary"
            focused
            fullWidth
            type="password"
            value={loginForm.password}
            onChange={(e) =>
              dispatch(
                setLoginForm({ field: "password", value: e.target.value })
              )
            }
          />
        </Box>
        <Box sx={{ width: "100%", mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => dispatch(iniciaSesionAsyn())}
          >
            Iniciar Sesión
          </Button>
        </Box>
        <Box sx={{ width: "100%", mt: 4 }}>
          <Divider>¿Aún no tienes cuenta? </Divider>
        </Box>
        <Box sx={{ width: "100%", mt: 2 }}>
          <Link to="/usuario/registro">
            <Typography>Crear una cuenta</Typography>
          </Link>
        </Box>
        <Box sx={{ width: "100%", mt: 4 }}>
          <Typography>Síguenos en nuestras redes sociales:</Typography>
          <a
            href="https://instagram.com/pezunasfelices_cl?igshid=YmMyMTA2M2Y="
            style={{ textDecoration: "none", cursor: "pointer" }}
          >
            <InstagramIcon
              color="primary"
              sx={{ fontSize: 40, cursor: "pointer" }}
            />
          </a>
        </Box>
      </Grid2>
    </Grid2>
  );
};

export default Login;
