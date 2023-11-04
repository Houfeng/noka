import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { createRoot } from "react-dom/client";
import { Box, createTheme, ThemeProvider, Toolbar } from "@mui/material";
import { NavBar } from "./views/NavBar";
import { observer } from "mota";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { Preferences } from "./pages/Preferences";
import { NotFound } from "./pages/NotFound";
import { NavDrawer } from "./views/NavDrawer";
import { UploadButton } from "./views/UploadButton";
import { Settings } from "./pages/Settings";
import { Upload } from "./pages/Upload";
import { Recently } from "./pages/Recently";
import { Albums } from "./pages/Albums";
import { Moments } from "./pages/Moments";
import { Tags } from "./pages/Tags";
import { Libraries } from "./pages/Libraries";
import { Portraits } from "./pages/Portraits";
import { Locations } from "./pages/Locations";
import { Favorites } from "./pages/Favorites";
import { LibrariesIndexed } from "./pages/Libraries";

const theme = createTheme({
  palette: { mode: "dark" },
});

const Pages = observer(function Pages() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/recently" element={<Recently />} />
      <Route path="/albums" element={<Albums />} />
      <Route path="/favorites" element={<Favorites />} />
      <Route path="/moments" element={<Moments />} />
      <Route path="/tags" element={<Tags />} />
      <Route path="/portraits" element={<Portraits />} />
      <Route path="/locations" element={<Locations />} />
      <Route path="/libraries/*" element={<Libraries />} />
      <Route path="/libraries-indexed" element={<LibrariesIndexed />} />
      <Route path="/upload" element={<Upload />} />
      <Route path="/preferences" element={<Preferences />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/*" element={<NotFound />} />
    </Routes>
  );
});

const App = observer(function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex" }}>
        <BrowserRouter basename="/">
          <NavBar />
          <NavDrawer />
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <Toolbar />
            <Pages />
          </Box>
          <UploadButton />
        </BrowserRouter>
      </Box>
    </ThemeProvider>
  );
});

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
