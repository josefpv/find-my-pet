import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import {
  Box,
  CardActionArea,
  CardActions,
  Chip,
  Divider,
  IconButton,
} from "@mui/material";
import PetsIcon from "@mui/icons-material/Pets";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useNavigate } from "react-router-dom";

const TarjetaNuevaMascota = () => {
  const navigate = useNavigate();

  return (
    <Card
      sx={{
        width: "100%",
        minHeight: "348px",
        maxHeight: "348px",
        minWidth: 214,
        maxWidth: 214,
      }}
    >
      <CardActionArea
        sx={{ paddingTop: 8 }}
        onClick={() => navigate("/mascotas/nueva")}
        component="span"
      >
        <Box sx={{ width: "100%", textAlign: "center", height: 348 }}>
          <PetsIcon color="primary" sx={{ fontSize: 80 }} />
          <Typography gutterBottom variant="h5" color="primary" component="div">
            Nueva Mascota
          </Typography>
        </Box>
        <CardContent></CardContent>
      </CardActionArea>
    </Card>
  );
};

export default TarjetaNuevaMascota;
