import { Drawer, IconButton, styled, useTheme } from "@mui/material";
import { observer } from "mota";
import React from "react";
import Divider from "@mui/material/Divider";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { layoutViewModel } from "../../models/LayoutViewModel";

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export const NavDrawer = observer(function NavDrawer() {
  const theme = useTheme();
  const { navDrawerOpen, closeNavDrawer } = layoutViewModel;
  const { navDrawerWidth } = layoutViewModel;
  return (
    <Drawer
      variant="permanent"
      anchor="left"
      open={navDrawerOpen}
      ModalProps={{ keepMounted: false }}
    >
      <DrawerHeader sx={{ width: navDrawerWidth }}>
        <IconButton onClick={closeNavDrawer}>
          {theme.direction === "ltr" ? (
            <ChevronLeftIcon />
          ) : (
            <ChevronRightIcon />
          )}
        </IconButton>
      </DrawerHeader>
      <Divider />
    </Drawer>
  );
});
