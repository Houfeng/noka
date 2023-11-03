import { Box, IconButton, Paper } from "@mui/material";
import { observer } from "mota";
import React from "react";
import FolderIcon from "@mui/icons-material/Folder";
import ImageIcon from "@mui/icons-material/Panorama";
import FileIcon from "@mui/icons-material/Attachment";
import { useNavigate } from "react-router-dom";
import { LibraryViewModel } from "./LibraryViewModel";
import { GridBox } from "../../components/GridBox";

export function isImageFile(name: string) {
  return ["jpg", "png"].some((ext) => name.endsWith(ext));
}

export type LibrariesListProps = {
  vm: LibraryViewModel;
};

export const LibrariesList = observer(function LibrariesList(
  props: LibrariesListProps,
) {
  const { vm } = props;
  const nav = useNavigate();
  return (
    <GridBox sx={{ m: 0 }} size={[280, 0]}>
      {vm.current?.children?.map((it: any) => (
        <IconButton
          key={it.path}
          sx={{ borderRadius: 2, boxShadow: 0, p: 1 }}
          onClick={() => nav(`.${it.path}`)}
        >
          <Paper
            sx={{
              padding: 2,
              borderRadius: 2,
              boxShadow: 1,
              overflow: "hidden",
              height: "100%",
              width: "100%",
              display: "grid",
              gridTemplateRows: "auto 36px",
            }}
          >
            <Box
              component="div"
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {it.type === "folder" && (
                <FolderIcon sx={{ fontSize: 72, opacity: 0.2 }} />
              )}
              {it.type === "file" && !isImageFile(it.name) && (
                <FileIcon sx={{ fontSize: 72, opacity: 0.2 }} />
              )}
              {it.type === "file" && isImageFile(it.name) && (
                <ImageIcon sx={{ fontSize: 72, opacity: 0.2 }} />
              )}
            </Box>
            <Box
              component="div"
              sx={{
                fontSize: 14,
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                opacity: 0.75,
              }}
            >
              {it.name}
            </Box>
          </Paper>
        </IconButton>
      ))}
    </GridBox>
  );
});
