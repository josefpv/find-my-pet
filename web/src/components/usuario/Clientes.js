import React, { useEffect } from "react";
import { Alert, Grid } from "@mui/material";
import Pantalla from "../inicio/Pantalla";
import Titulo from "../common/Titulo";
import { useDispatch, useSelector } from "react-redux";
import {
  obtieneClientes,
  resetUsuarios,
} from "../../redux/slices/usuarioSlice";
import { DataGrid, esES } from "@mui/x-data-grid";

const Clientes = () => {
  const dispatch = useDispatch();
  const usuarios = useSelector((state) => state.usuarios.usuarios);

  useEffect(() => {
    dispatch(obtieneClientes());
    return () => dispatch(resetUsuarios());
  }, []);

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "nombre", headerName: "Nombre", width: 180 },
    { field: "apellido", headerName: "Apellido", width: 180 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "telefono", headerName: "Teléfono", width: 100 },
    { field: "comuna", headerName: "Comuna", width: 200 },
    { field: "region", headerName: "Región", width: 200 },
    { field: "direccion", headerName: "Dirección", width: "auto" },
  ];

  return (
    <Pantalla>
      <Grid container spacing={4} sx={{ p: 4 }}>
        <Grid item xs={12} md={12} sx={{ mb: 4 }}>
          <Titulo label="Clientes" />
        </Grid>
        <Grid item xs={12} md={12}>
          {usuarios.length ? (
            <DataGrid
              localeText={esES.components.MuiDataGrid.defaultProps.localeText}
              rows={usuarios}
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
              No hay clientes registrados aún. 😔
            </Alert>
          )}
        </Grid>
      </Grid>
    </Pantalla>
  );
};

export default Clientes;
