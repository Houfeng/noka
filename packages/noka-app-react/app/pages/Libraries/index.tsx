import { Box, useTheme } from "@mui/material";
import { useQuery } from "../../common/Hooks";
import { observer } from "mota";
import React, { useMemo } from "react";
import { LibraryViewModel } from "./LibraryViewModel";
import { useParams } from "react-router-dom";
import { LibrariesNavBar } from "./LibrariesNavBar";
import { LibrariesList } from "./LibrariesList";
import { LibrariesIndexed } from "./LibrariesIndexed";

export { LibrariesIndexed };

export const Libraries = observer(function Libraries() {
  const theme = useTheme();
  const vm = useMemo(() => new LibraryViewModel(), []);
  const params = useParams();
  const path = params["*"];
  useQuery(() => vm.load(path), [vm, path]);
  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          position: "sticky",
          boxShadow: 1,
          m: -3,
          top: { xs: 56, sm: 64 },
          zIndex: 1,
          py: 2,
          px: 3,
          background: theme.palette.background.default,
          opacity: 0.9,
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid rgba(127,127,127,.1)",
        }}
      >
        <LibrariesNavBar vm={vm} />
      </Box>
      <Box sx={{ marginTop: 6 }}>
        <LibrariesList vm={vm} />
      </Box>
    </Box>
  );
});
