import { Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, styled, useTheme } from "@mui/material";
import { observer } from "mota";
import React from "react";
import Divider from "@mui/material/Divider";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { layoutViewModel } from "../../models/LayoutViewModel";
import InboxIcon from '@mui/icons-material/Inbox';
import DraftsIcon from '@mui/icons-material/Drafts';

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
    <DrawerHeaderWrapper sx={{ width: navDrawerWidth || 'auto' }}>
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
  return (
    <List>
      <ListItem disablePadding>
        <ListItemButton sx={{ height }}>
          <ListItemIcon sx={{ minWidth }}>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary={navDrawerOpen && "Inbox"} />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton sx={{ height }}>
          <ListItemIcon sx={{ minWidth }}>
            <DraftsIcon />
          </ListItemIcon>
          <ListItemText primary={navDrawerOpen && "Drafts"} />
        </ListItemButton>
      </ListItem>
      <Divider />
      <ListItem disablePadding>
        <ListItemButton sx={{ height }}>
          <ListItemIcon sx={{ minWidth }}>
            <DraftsIcon />
          </ListItemIcon>
          <ListItemText primary={navDrawerOpen && "Setting"} />
        </ListItemButton>
      </ListItem>
    </List>
  )
});

export const NavDrawer = observer(function NavDrawer() {
  const { navDrawerOpen } = layoutViewModel;
  return (
    <Drawer
      variant="permanent"
      anchor="left"
      open={navDrawerOpen}
      ModalProps={{ keepMounted: true }}
    >
      <DrawerHeader />
      <Divider />
      <DrawerMenus />
    </Drawer>
  );
});
