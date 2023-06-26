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
import QrCode2Icon from "@mui/icons-material/QrCode2";
import BallotIcon from "@mui/icons-material/Ballot";
import Diversity3Icon from "@mui/icons-material/Diversity3";

const MenuAdmin = () => {
  const activeMenu = useSelector((state) => state.menu.activeMenu);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const redirectMenu = (indexMenu) => {
    switch (indexMenu) {
      case 0:
        navigate("/inicio");
        break;
      case 1:
        navigate("/clientes");
        break;
      case 2:
        navigate("/qr/lista");
        break;
      case 3:
        navigate("/qr/generar");
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
        <BottomNavigationAction label="Clientes" icon={<Diversity3Icon />} />

        <BottomNavigationAction label="QRS" icon={<BallotIcon />} />

        <BottomNavigationAction label="Crear QR" icon={<QrCode2Icon />} />
      </BottomNavigation>
    </Box>
  );
};

export default MenuAdmin;
