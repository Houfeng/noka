import { Box, Breadcrumbs, IconButton, Link, Typography } from "@mui/material";
import { observer } from "mota";
import React from "react";
import { useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import { LibraryViewModel } from "./LibraryViewModel";
import FactCheckIcon from "@mui/icons-material/FactCheck";

export type LibrariesNavBarProps = {
  vm: LibraryViewModel;
};

const NavBreadcrumbs = observer(function NavBreadcrumbs(
  props: LibrariesNavBarProps,
) {
  const { vm } = props;
  const pathItems = vm.path.split("/").filter((it) => !!it);
  const nav = useNavigate();
  return (
    <Breadcrumbs aria-label="breadcrumb" sx={{ flexGrow: 1 }}>
      <Link
        key="/"
        underline="hover"
        color="inherit"
        sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}
        onClick={() => nav("/libraries")}
      >
        <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
        <Typography display="inline-block">Libraries</Typography>
      </Link>
      {pathItems.map((it, ix) => {
        const key = pathItems.slice(0, ix + 1).join("/");
        return (
          <Link
            key={key}
            underline="hover"
            color="inherit"
            sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}
            onClick={() => nav(`/libraries/${key}`)}
          >
            <Typography display="inline-block">{it}</Typography>
          </Link>
        );
      })}
    </Breadcrumbs>
  );
});

export const LibrariesNavBar = observer(function LibrariesNavBar(
  props: LibrariesNavBarProps,
) {
  const nav = useNavigate();
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <NavBreadcrumbs {...props} />
      <Box sx={{ width: 100, textAlign: "right" }}>
        <IconButton onClick={() => nav("/libraries-indexed")}>
          <FactCheckIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>
    </Box>
  );
});
