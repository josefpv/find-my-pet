import React, { useEffect, useState } from "react";
import Pantalla from "../inicio/Pantalla";
import Titulo from "../common/Titulo";
import {
  Alert,
  Button,
  Divider,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  Switch,
  Typography,
} from "@mui/material";
import QrCodeIcon from "@mui/icons-material/QrCode";
import { useDispatch, useSelector } from "react-redux";
import { nuevoQR, obtieneQrs, reset } from "../../redux/slices/qrSlice";
import { DataGrid, esES } from "@mui/x-data-grid";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import DownloadIcon from "@mui/icons-material/Download";
import config from "./../../config.json";

const Generador = () => {
  const dispatch = useDispatch();
  const qrList = useSelector((state) => state.qr.qrs);
  const qrSerialCreado = useSelector((state) => state.qr.qrSerialCreado);
  const [showSerial, setShowSerial] = useState(false);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const renderIconActivo = ({ row }) => {
    if (row.activo) {
      return <CheckIcon color="primary" />;
    }

    return <CloseIcon color="secondary" />;
  };

  const padTo2Digits = (num) => {
    return num.toString().padStart(2, "0");
  };

  const renderDate = (field, { row }) => {
    if (row[field]) {
      const fechaAct = new Date(row[field]);
      return `${padTo2Digits(fechaAct.getDate())}-${padTo2Digits(
        fechaAct.getMonth() + 1
      )}-${fechaAct.getFullYear()}`;
    }

    return "";
  };

  const renderShowClaveIcon = ({ row }) => {
    if (!showSerial) {
      return <>****************</>;
    } else {
      return <>{row.clave}</>;
    }
  };

  const handleCreaQR = () => {
    dispatch(nuevoQR());
    dispatch(obtieneQrs());
    setOpen(false);
  };

  const renderDescargaQr = ({ row }) => {
    return (
      <IconButton
        color="primary"
        onClick={() =>
          window.open(
            `${config.endpoints.previewQR.dominio}:${config.endpoints.previewQR.puerto}${config.endpoints.previewQR.url}${row.serial}`,
            "_blank",
            "rel=noopener noreferrer"
          )
        }
      >
        <DownloadIcon />
      </IconButton>
    );
  };

  useEffect(() => {
    if (qrSerialCreado != "") {
      window.open(
        `${config.endpoints.previewQR.dominio}:${config.endpoints.previewQR.puerto}${config.endpoints.previewQR.url}${qrSerialCreado}`,
        "_blank",
        "rel=noopener noreferrer"
      );
    }
  }, [qrSerialCreado]);

  useEffect(() => {
    dispatch(obtieneQrs());
    return () => {
      dispatch(reset());
    };
  }, []);

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "serial",
      headerName: "Serial",
      width: 200,
    },
    {
      field: "clave",
      headerName: "Clave",
      width: 200,
      renderCell: renderShowClaveIcon,
    },
    {
      field: "mascota",
      headerName: "Mascota",
      width: 120,
    },
    {
      field: "fecha_solicitud",
      headerName: "Solicitud",
      width: 150,
      renderCell: (row) => renderDate(row.field, row),
    },
    { field: "usuario", headerName: "Usuario", width: 200 },
    {
      field: "fecha_activacion",
      headerName: "Activación",
      width: 150,
      renderCell: (row) => renderDate(row.field, row),
    },
    {
      field: "fecha_vencimiento",
      headerName: "Vencimiento",
      width: 150,
      renderCell: (row) => renderDate(row.field, row),
    },
    {
      field: "activo",
      headerName: "Activo",
      width: 100,
      renderCell: renderIconActivo,
    },
    {
      field: "descargar",
      headerName: "Descargar",
      width: 100,
      renderCell: renderDescargaQr,
    },
  ];

  return (
    <Pantalla>
      <Grid container spacing={4} sx={{ p: 4 }}>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            ¿Desea generar un nuevo código QR?
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Al generar un nuevo código QR este contendrá un serial y una clave
              el cual deberás entregar a tu cliente. No olvides que la clave es
              exclusivo para el cliente y este es indispensable para su
              activación, NO LA COMPARTAS.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>No</Button>
            <Button onClick={() => handleCreaQR()} autoFocus>
              Sí, crear nuevo QR
            </Button>
          </DialogActions>
        </Dialog>
        <Grid item xs={12} md={12} sx={{ mb: 4 }}>
          <Titulo label="Generador Código QR" />
        </Grid>

        <Grid md={12} xs={12}>
          <Grid container justifyContent="center">
            <IconButton
              color="neutro"
              aria-label="add an alarm"
              sx={{ color: "#ffffff" }}
              onClick={handleClickOpen}
            >
              <QrCodeIcon
                sx={{
                  fontSize: 100,
                  backgroundColor: "#006472",
                  borderRadius: 20,
                  padding: 2,
                }}
              />
            </IconButton>
          </Grid>
        </Grid>
        <Grid md={12} xs={12} sx={{ textAlign: "center" }}>
          <Typography>GENERAR NUEVO QR</Typography>
        </Grid>
        <Grid md={12} xs={12} sx={{ textAlign: "center", marginTop: 4 }}>
          <Divider />
        </Grid>
        <Grid md={12} xs={12} sx={{ p: 2, textAlign: "center" }}>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={showSerial}
                  onChange={() => setShowSerial((prev) => !prev)}
                />
              }
              label="Mostrar claves"
            />
          </FormGroup>
        </Grid>
        <Grid md={12} xs={12} sx={{ p: 2, textAlign: "center" }}>
          {qrList.length ? (
            <DataGrid
              localeText={esES.components.MuiDataGrid.defaultProps.localeText}
              rows={qrList}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 20,
                  },
                },
              }}
              pageSizeOptions={[20]}
              checkboxSelection={false}
              disableRowSelectionOnClick
            />
          ) : (
            <Alert variant="outlined" severity="warning">
              {" "}
              No hay códigos QR registrados aún. 😔
            </Alert>
          )}
        </Grid>
      </Grid>
    </Pantalla>
  );
};

export default Generador;
