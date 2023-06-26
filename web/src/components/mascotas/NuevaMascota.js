import React, { useEffect, useState } from "react";
import Pantalla from "../inicio/Pantalla";
import {
  Box,
  Button,
  Fab,
  Grid,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import Titulo from "./../common/Titulo";
import MascotaForm from "./MascotaForm";
import QRForm from "./QRForm";
import { validaQR } from "../../redux/slices/qrSlice";
import { useDispatch, useSelector } from "react-redux";
import FinalizaRegistro from "./FinalizaRegistro";
import { useNavigate } from "react-router-dom";
import {
  setInitialState,
  createMascotaAsync,
} from "../../redux/slices/mascotasSlice";
import { toast } from "react-toastify";
import FotosMascota from "./FotosMascota";
import ReplyIcon from "@mui/icons-material/Reply";

const NuevaMascota = () => {
  const steps = [
    {
      label: "Datos QR",
      description: `Ingresa los datos de la tarjeta asociada al código QR que recibiste 🔖.`,
      component: <QRForm />,
    },
    {
      label: "Datos de tu mascota",
      description: `Ingresa los datos de tu mascota 🐶🐱.`,
      component: <MascotaForm />,
    },
    {
      label: "Fotos de tu mascota",
      description: `Ahora es tiempo de subir algunas fotitos que tengas de tu mascota 🥰.`,
      component: <FotosMascota />,
    },
    {
      label: "Finaliza el registro",
      description: ``,
      component: <FinalizaRegistro />,
    },
  ];

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const qrData = useSelector((state) => state.mascotas.qrData);
  const mascotaData = useSelector((state) => state.mascotas.mascotaData);
  const fotosMascota = useSelector((state) => state.mascotas.fotosDT);

  useEffect(() => {
    return () => {
      dispatch(setInitialState());
    };
  }, []);

  const validaDatosMascota = () => {
    const {
      nombre,
      descripcion,
      tamano,
      color1,
      especie,
      raza,
      genero,
      nombreAlterno,
    } = mascotaData;

    if (
      nombre == "" ||
      descripcion == "" ||
      tamano == "" ||
      color1 == "" ||
      especie == "" ||
      genero == "" ||
      nombreAlterno == ""
    ) {
      return false;
    }

    return true;
  };

  const validaFotosMascota = () => {
    return fotosMascota.files.length;
  };

  const handleNext = async () => {
    if (activeStep == 0) {
      if (await validaQR(qrData.serial, qrData.clave)) {
        setActiveStep((prev) => prev + 1);
        toast.success("¡QR validado exitosamente!");
      } else {
        toast.error(
          "Serial o clave de QR incorrectos, por favor intente nuevamente"
        );
      }
    } else if (activeStep == 1) {
      if (!validaDatosMascota()) {
        toast.error("Debe ingresar los datos de la mascota para continuar.");
        return;
      }

      setActiveStep((prev) => prev + 1);
    } else if (activeStep == 2) {
      if (!validaFotosMascota()) {
        toast.error("Debes seleccionar al menos 1 foto de tu mascota.");
        return;
      }
      dispatch(createMascotaAsync());

      setActiveStep((prev) => prev + 1);
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Pantalla>
      <Grid container spacing={2} sx={{ p: 4 }}>
        <Grid item xs={12} md={12}>
          <Titulo label="Nueva Mascota" />
        </Grid>
        <Grid item xs={12} md={12}>
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel
                  optional={
                    index === 2 ? (
                      <Typography variant="caption">Último paso</Typography>
                    ) : null
                  }
                >
                  {step.label}
                </StepLabel>
                <StepContent>
                  <Typography>{step.description}</Typography>
                  {step.component}
                  <Box sx={{ mb: 2 }}>
                    <div>
                      <Button
                        variant="contained"
                        onClick={
                          index === steps.length - 1
                            ? () => navigate("/mascotas")
                            : handleNext
                        }
                        sx={{ mt: 1, mr: 1 }}
                      >
                        {index === steps.length - 1 ? "Finaliar" : "Continuar"}
                      </Button>
                      <Button
                        disabled={index === 0 || activeStep == 3}
                        onClick={handleBack}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        Atrás
                      </Button>
                    </div>
                  </Box>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </Grid>
        <Grid sx={{ position: "absolute", bottom: 70, right: 10 }}>
          <Fab
            color="primary"
            aria-label="regresar"
            onClick={() => navigate("/mascotas")}
          >
            <ReplyIcon />
          </Fab>
        </Grid>
      </Grid>
    </Pantalla>
  );
};

export default NuevaMascota;
