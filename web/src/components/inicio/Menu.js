import * as React from "react";
import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PetsIcon from "@mui/icons-material/Pets";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { changeActiveMenu } from "./../../redux/slices/menuSlice";

const Menu = () => {
  const activeMenu = useSelector((state) => state.menu.activeMenu);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const redirectMenu = (indexMenu) => {
    switch (indexMenu) {
      case 0:
        navigate("/inicio");
        break;
      case 1:
        navigate("/usuario/perfil");
        break;
      case 2:
        navigate("/mascotas");
        break;
      case 3:
        navigate("/qrs");
        break;
      default:
        navigate("/inicio");
        break;
    }
  };

  return (
    <Box sx={{ width: "100%", position: "fixed", bottom: 0 }}>
      <BottomNavigation
        showLabels
        value={activeMenu}
        onChange={(event, newValue) => {
          dispatch(changeActiveMenu(newValue));
          redirectMenu(newValue);
        }}
      >
        <BottomNavigationAction label="Inicio" icon={<HomeIcon />} />
        <BottomNavigationAction
          label="Mi Perfil"
          icon={<AccountCircleIcon />}
        />

        <BottomNavigationAction label="Mis Mascotas" icon={<PetsIcon />} />

        {/*         <BottomNavigationAction label="Crear QR" icon={<QrCodeScannerIcon />} /> */}
      </BottomNavigation>
    </Box>
  );
};

export default Menu;
