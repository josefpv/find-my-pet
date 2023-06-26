import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Divider,
  Grid,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  ListSubheader,
  Typography,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { setFotosEliminadas } from "./../../redux/slices/mascotasSlice";
import { toast } from "react-toastify";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";

const FotosMascota = ({ urlImagenes }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState([]);
  const [imageDT, setImageDT] = useState(new DataTransfer());
  const inputFile = useRef();
  const dispatch = useDispatch();
  const fotosDT = useSelector((state) => state.mascotas.fotosDT);
  const fotosUrl = useSelector((state) => state.mascotas.mascotaData.fotosUrl);

  useEffect(() => {
    if (fotosUrl && fotosUrl.length) {
      console.log("viene con url de imagenes");
      setImageUrl(fotosUrl);
    }
  }, [fotosUrl]);

  const handleChangeImage = (files) => {
    const dt = new DataTransfer();
    const cantFotos = imageDT.files.length;
    if (cantFotos < 4 && imageUrl.length < 4) {
      console.log("ENTRO ACA");
      setSelectedImage(files);
      const { length: cantFotos } = files;
      //para edicion verifico que las fotos seleccionadas no sobrepasen los espacios disponibles
      if (cantFotos > 4 - imageUrl.length) {
        toast.error(
          `Solo se permiten hasta 4 fotos. ${
            4 - imageUrl.length
          } fotos restante.`
        );
        return;
      }
      for (var i = 0; i < cantFotos; i++) {
        let url = URL.createObjectURL(files[i]);
        setImageUrl((prevImg) => [...prevImg, url]);
        dt.items.add(files[i]);
        fotosDT.items.add(files[i]);
      }
      setImageDT(dt);
    } else {
      toast.error("Solo se permiten hasta 4 fotos.");
    }

    console.log(imageDT);
  };

  const deleteImage = (item, index) => {
    console.log(item);
    console.log(index);
    imageDT.items.remove(index);
    fotosDT.items.remove(index);

    //
    const copyImagesUrl = [...imageUrl];
    copyImagesUrl.splice(index, 1);
    console.log("COPIA IMGE URL: ", copyImagesUrl);
    setImageUrl(copyImagesUrl);
    dispatch(setFotosEliminadas(item));
    if (!copyImagesUrl.length) {
      inputFile.current.value = null;
    }
  };

  return (
    <Grid container spacing={2} sx={{ pt: 2 }} justifyContent="center">
      <Grid item xs={12} md={12} sx={{ textAlign: "center" }}>
        <IconButton
          color="primary"
          aria-label="upload picture"
          component="label"
        >
          <input
            hidden
            accept="image/*"
            type="file"
            multiple
            ref={inputFile}
            onChange={(e) => handleChangeImage(e.target.files)}
          />
          <PhotoCamera sx={{ fontSize: 80 }} />
        </IconButton>
      </Grid>
      <Grid item xs={12} md={12} sx={{ textAlign: "center" }}>
        <Divider>Fotos seleccionadas</Divider>
      </Grid>
      <Grid item xs={12} md={12} sx={{ textAlign: "center" }}>
        <Grid container justifyContent="center" alignContent="center">
          {imageUrl.length > 0 ? (
            <ImageList sx={{ height: 700, width: 600 }}>
              <ImageListItem key="Subheader" cols={2}>
                <ListSubheader component="div">
                  Fotitos seleccionadas ❤️
                </ListSubheader>
              </ImageListItem>
              {imageUrl.map((item, index) => (
                <ImageListItem key={index}>
                  <img
                    src={`${item}`}
                    srcSet={`${item}`}
                    alt=""
                    loading="lazy"
                  />
                  <ImageListItemBar
                    title={`Foto ${index + 1}`}
                    subtitle=""
                    actionIcon={
                      <IconButton
                        sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                        onClick={() => deleteImage(item, index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                  />
                </ImageListItem>
              ))}
            </ImageList>
          ) : (
            <Box sx={{ width: "100%" }}>
              <Typography variant="h5" sx={{ textAlign: "center" }}>
                No ha seleccionado ninguna imagen
              </Typography>
              <SentimentVeryDissatisfiedIcon
                sx={{ fontSize: 60 }}
                color="primary"
              />
            </Box>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default FotosMascota;
