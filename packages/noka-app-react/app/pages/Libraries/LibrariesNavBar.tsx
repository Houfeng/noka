import { Breadcrumbs, Link, Typography } from "@mui/material";
import { observer } from "mota";
import React from "react";
import { useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import { LibraryViewModel } from "./LibraryViewModel";

export type LibrariesNavBarProps = {
  vm: LibraryViewModel;
};

export const LibrariesNavBar = observer(function LibrariesNavBar(
  props: LibrariesNavBarProps,
) {
  const { vm } = props;
  const pathItems = vm.path.split("/").filter((it) => !!it);
  const nav = useNavigate();
  return (
    <Breadcrumbs aria-label="breadcrumb">
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
