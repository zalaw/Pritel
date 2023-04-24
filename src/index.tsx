import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import "./styles/main.css";
import { AuthProvider } from "./contexts/AuthContext";
import { BrowserRouter } from "react-router-dom";
import { MantineProvider } from "@mantine/core";

process.env.TZ = "Europe/Bucharest";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  // <React.StrictMode>
  <BrowserRouter>
    <AuthProvider>
      <MantineProvider theme={{ colorScheme: "dark" }} withGlobalStyles withNormalizeCSS>
        <App />
      </MantineProvider>
    </AuthProvider>
  </BrowserRouter>
  // </React.StrictMode>
);
