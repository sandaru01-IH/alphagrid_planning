import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ConsultProvider } from "./state/consult";
import { ThemeProvider } from "./state/theme";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <ConsultProvider>
        <App />
      </ConsultProvider>
    </ThemeProvider>
  </StrictMode>
);
