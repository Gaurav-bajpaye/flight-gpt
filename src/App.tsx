import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  AppBar,
  Toolbar,
  Typography,
  CircularProgress,
} from "@mui/material";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import ChatInterface from "./components/ChatInterface.tsx";
import { dataService } from "./services/DataService.ts";

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data when the app starts
  useEffect(() => {
    const loadData = async () => {
      try {
        await dataService.loadData();
        setLoading(false);
      } catch (err) {
        setError("Failed to load flight data. Please refresh the page.");
        setLoading(false);
        console.error(err);
      }
    };

    loadData();
  }, []);

  return (
    // <CssBaseline />
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <AppBar position="sticky">
        <Toolbar>
          <FlightTakeoffIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Flight Data Analyzer
          </Typography>
        </Toolbar>
      </AppBar>

      <Container
        maxWidth="lg"
        sx={{
          flex: 1,
          py: 4,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <CircularProgress />
            <Typography variant="body1" sx={{ ml: 2 }}>
              Loading flight data...
            </Typography>
          </Box>
        ) : error ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              color: "error.main",
            }}
          >
            <Typography variant="h6">{error}</Typography>
          </Box>
        ) : (
          <Box sx={{ height: "100%" }}>
            <ChatInterface />
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default App;
