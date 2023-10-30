import { Fab } from "@mui/material";
import { observer } from "mota";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import React from "react";
import { useNavigate } from "react-router-dom";

export const UploadButton = observer(function UploadButton() {
  const nav = useNavigate();
  return (
    <Fab
      color="primary"
      aria-label="add"
      size="large"
      sx={{
        position: "absolute",
        bottom: 24,
        right: 24,
      }}
      onClick={() => nav("/upload")}
    >
      <AddPhotoAlternateIcon />
    </Fab>
  );
});
