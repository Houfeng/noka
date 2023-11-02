import {
  Box,
  Breadcrumbs,
  IconButton,
  Link,
  Paper,
  Typography,
} from "@mui/material";
import { useQuery } from "../../common/Hooks";
import { observer } from "mota";
import React, { useMemo } from "react";
import { LibraryViewModel } from "./LibraryViewModel";
import FolderIcon from "@mui/icons-material/Folder";
import ImageIcon from "@mui/icons-material/Panorama";
import FileIcon from "@mui/icons-material/Attachment";
import { useNavigate, useParams } from "react-router-dom";

function isImageFile(name: string) {
  return ["jpg", "png"].some((ext) => name.endsWith(ext));
}

type LibrariesNavBarProps = {
  vm: LibraryViewModel;
};

const LibrariesNavBar = observer(function LibrariesNavBar(
  props: LibrariesNavBarProps,
) {
  const { vm } = props;
  const pathItems = vm.path.split("/").filter((it) => !!it);
  const nav = useNavigate();
  return (
    <Breadcrumbs aria-label="breadcrumb" style={{ marginBottom: 16 }}>
      <Link
        key="/"
        underline="hover"
        color="inherit"
        sx={{ cursor: "pointer" }}
        onClick={() => nav("/libraries")}
      >
        <Typography display="inline-block">Libraries</Typography>
      </Link>
      {pathItems.map((it, ix) => {
        const key = pathItems.slice(0, ix + 1).join("/");
        return (
          <Link
            key={key}
            underline="hover"
            color="inherit"
            sx={{ cursor: "pointer" }}
            onClick={() => nav(`/libraries/${key}`)}
          >
            <Typography display="inline-block">{it}</Typography>
          </Link>
        );
      })}
    </Breadcrumbs>
  );
});

type LibrariesListProps = {
  vm: LibraryViewModel;
};

const LibrariesList = observer(function LibrariesList(
  props: LibrariesListProps,
) {
  const { vm } = props;
  const nav = useNavigate();
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        m: -1,
      }}
    >
      {vm.current?.children?.map((it: any) => (
        <IconButton
          sx={{ borderRadius: 1, p: 0 }}
          onClick={() => nav(`.${it.path}`)}
        >
          <Paper
            key={it.path}
            sx={{
              m: 1,
              width: 240,
              height: 240,
              padding: 2,
              overflow: "hidden",
              textOverflow: "ellipsis",
              textAlign: "center",
            }}
          >
            {it.type === "folder" && (
              <FolderIcon sx={{ fontSize: 170, opacity: 0.2 }} />
            )}
            {it.type === "file" && !isImageFile(it.name) && (
              <FileIcon sx={{ fontSize: 170, opacity: 0.2 }} />
            )}
            {it.type === "file" && isImageFile(it.name) && (
              <ImageIcon sx={{ fontSize: 170, opacity: 0.2 }} />
            )}
            <Typography color="text.primary">{it.name}</Typography>
          </Paper>
        </IconButton>
      ))}
    </Box>
  );
});

export const Libraries = observer(function Libraries() {
  const vm = useMemo(() => new LibraryViewModel(), []);
  const params = useParams();
  const path = params["*"];
  useQuery(() => vm.load(`/${path}`), [vm, path]);
  return (
    <Box sx={{ width: "100%" }}>
      <LibrariesNavBar vm={vm} />
      <LibrariesList vm={vm} />
    </Box>
  );
});
