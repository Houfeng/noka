import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
  useTheme,
} from "@mui/material";
import { observer } from "mota";
import { layoutViewModel } from "../../models/LayoutViewModel";
import React from "react";
import Divider from "@mui/material/Divider";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import SettingsIcon from "@mui/icons-material/Settings";
import ImageIcon from "@mui/icons-material/Image";
import ReceiptIcon from "@mui/icons-material/Receipt";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import PortraitIcon from "@mui/icons-material/Portrait";
import { useNavigate } from "react-router-dom";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";

const DrawerHeaderWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

const DrawerHeader = observer(function DrawerHeader() {
  const theme = useTheme();
  const { navDrawerOpen, closeNavDrawer } = layoutViewModel;
  const { navDrawerWidth } = layoutViewModel;
  return (
    <DrawerHeaderWrapper sx={{ width: navDrawerWidth || "auto" }}>
      {navDrawerOpen && (
        <IconButton onClick={closeNavDrawer}>
          {theme.direction === "ltr" ? (
            <ChevronLeftIcon />
          ) : (
            <ChevronRightIcon />
          )}
        </IconButton>
      )}
    </DrawerHeaderWrapper>
  );
});

const DrawerMenus = observer(function DrawerMenus() {
  const { navDrawerOpen } = layoutViewModel;
  const minWidth = navDrawerOpen ? 40 : 0;
  const height = 56;
  const nav = useNavigate();
  return (
    <List>
      <ListItem disablePadding>
        <ListItemButton sx={{ height }} onClick={() => nav("/recently")}>
          <ListItemIcon sx={{ minWidth }}>
            <ReceiptIcon />
          </ListItemIcon>
          <ListItemText primary={navDrawerOpen && "Recently"} />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton sx={{ height }} onClick={() => nav("/albums")}>
          <ListItemIcon sx={{ minWidth }}>
            <ImageIcon />
          </ListItemIcon>
          <ListItemText primary={navDrawerOpen && "Albums"} />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton sx={{ height }} onClick={() => nav("/moments")}>
          <ListItemIcon sx={{ minWidth }}>
            <AccessTimeIcon />
          </ListItemIcon>
          <ListItemText primary={navDrawerOpen && "Moments"} />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton sx={{ height }} onClick={() => nav("/tags")}>
          <ListItemIcon sx={{ minWidth }}>
            <LocalOfferIcon />
          </ListItemIcon>
          <ListItemText primary={navDrawerOpen && "Tags"} />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton sx={{ height }} onClick={() => nav("/portrait")}>
          <ListItemIcon sx={{ minWidth }}>
            <PortraitIcon />
          </ListItemIcon>
          <ListItemText primary={navDrawerOpen && "Portrait"} />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton sx={{ height }} onClick={() => nav("/location")}>
          <ListItemIcon sx={{ minWidth }}>
            <AddLocationAltIcon />
          </ListItemIcon>
          <ListItemText primary={navDrawerOpen && "Location"} />
        </ListItemButton>
      </ListItem>
      <Divider />
      <ListItem disablePadding>
        <ListItemButton sx={{ height }} onClick={() => nav("/libraries")}>
          <ListItemIcon sx={{ minWidth }}>
            <PhotoLibraryIcon />
          </ListItemIcon>
          <ListItemText primary={navDrawerOpen && "Libraries"} />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton sx={{ height }} onClick={() => nav("/settings")}>
          <ListItemIcon sx={{ minWidth }}>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary={navDrawerOpen && "Settings"} />
        </ListItemButton>
      </ListItem>
    </List>
  );
});

export const NavDrawer = observer(function NavDrawer() {
  const { navDrawerOpen, navDrawerWidth } = layoutViewModel;
  return (
    <Drawer
      variant="permanent"
      anchor="left"
      open={navDrawerOpen}
      ModalProps={{ keepMounted: true }}
      sx={{ width: navDrawerWidth || 56 }}
    >
      <DrawerHeader />
      <Divider />
      <DrawerMenus />
    </Drawer>
  );
});
