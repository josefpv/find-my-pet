import React, { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  IconButton,
  Switch,
  FormGroup,
  FormControlLabel,
  Divider,
  Alert,
} from "@mui/material";
import Titulo from "../common/Titulo";
import Pantalla from "../inicio/Pantalla";
import { useDispatch, useSelector } from "react-redux";
import { obtieneQrs, reset, toggleEstado } from "../../redux/slices/qrSlice";
import DownloadIcon from "@mui/icons-material/Download";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { DataGrid, esES } from "@mui/x-data-grid";
import config from "./../../config.json";

const QR = () => {
  const dispatch = useDispatch();
  const qrList = useSelector((state) => state.qr.qrs);
  const [showSerial, setShowSerial] = useState(false);

  const toggleEstadoQR = (estado, id) => {
    dispatch(toggleEstado(estado, id));
  };

  const renderIconActivo = ({ row }) => {
    if (row.activo) {
      return (
        <IconButton
          color="primary"
          onClick={() => toggleEstadoQR(false, row.id)}
        >
          <CheckIcon />
        </IconButton>
      );
    }

    return (
      <IconButton
        color="secondary"
        onClick={() => toggleEstadoQR(true, row.id)}
      >
        <CloseIcon />
      </IconButton>
    );
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
    dispatch(obtieneQrs());
    return () => dispatch(reset());
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
        <Grid item xs={12} md={12} sx={{ mb: 1 }}>
          <Titulo label="Códigos QR" />
        </Grid>

        <Grid item md={12} xs={12} sx={{ p: 2, textAlign: "center" }}>
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
        <Grid item xs={12} md={12}>
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

export default QR;
