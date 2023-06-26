import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import {
  CardActionArea,
  CardActions,
  Chip,
  Divider,
  IconButton,
} from "@mui/material";
import SinFoto from "./../images/sin_foto_perro.jpeg";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import WarningIcon from "@mui/icons-material/Warning";
import { useNavigate } from "react-router-dom";

const TarjetaMascota = ({ mascota, urlImagenes, onDelete }) => {
  const navigate = useNavigate();

  const handleEditaMascota = (idMascota) => {
    navigate(`/mascota/edita/${idMascota}`);
  };

  const handleEliminaMascota = (mascota) => {
    onDelete(mascota);
  };

  return (
    <Card
      sx={{
        width: "100%",
        minHeight: "348px",
        maxHeight: "348px",
        minWidth: 214,
        maxWidth: 214,
      }}
      component="div"
    >
      <CardActionArea component="span">
        <CardMedia
          component="img"
          height="200"
          image={
            urlImagenes[mascota.id][0] ? urlImagenes[mascota.id][0] : SinFoto
          }
          alt="green iguana"
        />
        <CardContent>
          <Typography variant="h5" color="primary" component="div">
            {mascota.nombre}
          </Typography>
          <Typography sx={{ mb: 0.5 }} color="text.secondary">
            {`Especie: ${mascota.especie}`}
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <IconButton
            aria-label="editar"
            onClick={() => handleEditaMascota(mascota.id)}
          >
            <EditIcon color="primary" />
          </IconButton>
          <IconButton
            aria-label="eliminar"
            onClick={() => {
              handleEliminaMascota(mascota);
            }}
          >
            <DeleteIcon color="secondary" />
          </IconButton>
        </CardActions>
      </CardActionArea>
    </Card>
  );
};

export default TarjetaMascota;
