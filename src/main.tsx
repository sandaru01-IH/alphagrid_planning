import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ConsultProvider } from "./state/consult";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConsultProvider>
      <App />
    </ConsultProvider>
  </StrictMode>
);
