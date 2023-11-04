import {
  Alert,
  AlertTitle,
  Box,
  Button,
  LinearProgress,
  Paper,
  Typography,
} from "@mui/material";
import { observer } from "mota";
import React from "react";

export const LibrariesIndexed = observer(function LibrariesIndexed() {
  return (
    <Box sx={{ maxWidth: 1024, mx: "auto" }}>
      <Alert severity="info" variant="outlined">
        <AlertTitle>Indexing</AlertTitle>
        All photos in the library will be re indexed and the original photos
        will not be deleted or changed. Non ExtIf information manually filled in
        will also be retained
      </Alert>
      <br />
      <Paper sx={{ p: 4 }}>
        <Typography sx={{ display: "block" }} variant="caption">
          Not started
        </Typography>
        <br />
        <LinearProgress variant="determinate" value={0} />
        <br />
        <br />
        <Button variant="contained">Start Indexing</Button>
      </Paper>
    </Box>
  );
});
