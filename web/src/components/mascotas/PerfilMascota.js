import React, { useEffect } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import { Avatar, Divider, Typography } from "@mui/material";
import SinFoto from "./../images/sin_foto_perro.jpeg";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getMascotaInfoBySerial } from "../../redux/slices/mascotaPerfilSlice";
import Brightness1Icon from "@mui/icons-material/Brightness1";

const PerfilMascota = () => {
  let params = useParams();
  const dispatch = useDispatch();
  const { mascotaInfo, urlImagenes } = useSelector(
    (state) => state.mascotaPerfil
  );

  useEffect(() => {
    if (params && params.serial) {
      dispatch(getMascotaInfoBySerial(params.serial));
    }
  }, []);

  return (
    <Grid container>
      {mascotaInfo && mascotaInfo.id ? (
        <>
          <Grid
            md={12}
            xs={12}
            sx={{
              backgroundColor: "#f5c842",
              height: 95,
              paddingTop: 2,
              textAlign: "center",
            }}
          >
            <Typography variant="h3" sx={{ textAlign: "center" }}>
              ¡Ayúdame, estoy perdido!
            </Typography>
            <Typography variant="body" sx={{ textAlign: "center" }}>
              Revisa mi información y contacta a mis dueños
            </Typography>
          </Grid>
          <Grid md={12} xs={12}>
            <Grid container justifyContent="center">
              {urlImagenes && urlImagenes.length > 0 ? (
                urlImagenes.map((foto) => (
                  <Avatar
                    alt="Sin foto"
                    src={foto}
                    sx={{ width: 300, height: 300, m: 2 }}
                  />
                ))
              ) : (
                <Avatar
                  alt="Sin foto"
                  src={SinFoto}
                  sx={{ width: 300, height: 300 }}
                />
              )}
            </Grid>
            <Grid
              xs={12}
              md={12}
              sx={{
                textAlign: "center",
                pt: 2,
              }}
            >
              <Divider>Nombre</Divider>
              <Typography variant="h5" color="primary">
                {mascotaInfo.nombre}
              </Typography>
            </Grid>
            <Grid
              xs={12}
              md={12}
              sx={{
                textAlign: "center",
                pt: 2,
              }}
            >
              <Divider sx={{ marginBottom: 2 }}>Color(es)</Divider>
              <Typography variant="h5" color="primary">
                <Brightness1Icon
                  sx={{
                    fontSize: 80,
                    color: mascotaInfo.color1,
                    borderColor: "#000000",
                    borderStyle: "solid",
                    borderWidth: 2,
                  }}
                />
              </Typography>
              {mascotaInfo.color2 && (
                <Typography variant="h5" color="primary">
                  <Brightness1Icon
                    sx={{
                      fontSize: 80,
                      color: mascotaInfo.color2,
                      borderColor: "#000000",
                      borderStyle: "solid",
                      borderWidth: 2,
                    }}
                  />
                </Typography>
              )}
            </Grid>
            <Grid
              xs={12}
              md={12}
              sx={{
                textAlign: "center",
                pt: 2,
              }}
            >
              <Divider>Tamaño</Divider>
              <Typography variant="h5" color="primary">
                {mascotaInfo.tamano}
              </Typography>
            </Grid>
            <Grid
              xs={12}
              md={12}
              sx={{
                textAlign: "center",
                pt: 2,
              }}
            >
              <Divider>Responde al nombre</Divider>
              <Typography variant="h5" color="primary">
                {mascotaInfo.nombre_alterno}
              </Typography>
            </Grid>
            <Grid
              xs={12}
              md={12}
              sx={{
                textAlign: "center",
                pt: 2,
              }}
            >
              <Divider>Nombre dueño</Divider>
              <Typography variant="h5" color="primary">
                {`${mascotaInfo.nombre_propietario} ${mascotaInfo.apellido_propietario}`}
              </Typography>
            </Grid>
            <Grid
              xs={12}
              md={12}
              sx={{
                textAlign: "center",
                pt: 2,
              }}
            >
              <Divider>Teléfono de contacto</Divider>
              <Typography variant="h5" color="primary">
                {`+56${mascotaInfo.telefono}`}
              </Typography>
              <Divider>Email de contacto</Divider>
              <Typography variant="h5" color="primary">
                {mascotaInfo.email}
              </Typography>
            </Grid>
          </Grid>
        </>
      ) : null}
    </Grid>
  );
};

export default PerfilMascota;
