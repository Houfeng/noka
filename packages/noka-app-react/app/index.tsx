import React from "react";
import { createRoot } from "react-dom/client";
import { Box, createTheme, ThemeProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { NavBar } from "./views/NavBar";
import { observer } from "mota";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { Preferences } from "./pages/Preferences";
import { NotFound } from "./pages/NotFound";
import { NavDrawer } from "./views/NavDrawer";

const theme = createTheme({
  palette: { mode: "dark" },
});

const App = observer(function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <NavBar />
        <NavDrawer />
        <BrowserRouter basename="/">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/preferences" element={<Preferences />} />
            <Route path="/*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </Box>
    </ThemeProvider>
  );
});

const root = createRoot(document.getElementById("root"));
root.render(<App />);
