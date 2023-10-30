import { observer } from "mota";
import React from "react";
import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { UserAvatar } from "../UserAvatar";
import { layoutViewModel } from "../../models/LayoutViewModel";

export const NavBar = observer(function NavBar() {
  const { navDrawerWidth, toggleNavDrawer } = layoutViewModel;
  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: 10000,
        width: {
          sm: `calc(100% - ${navDrawerWidth}px)`,
        },
      }}
    >
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={toggleNavDrawer}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
          Noka
        </Typography>
        <UserAvatar />
      </Toolbar>
    </AppBar>
  );
});
