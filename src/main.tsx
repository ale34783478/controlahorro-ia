// Aquí inicio la aplicación de React, cargo sus estilos y la envuelvo en una protección para mostrar un mensaje si ocurre un error.
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ErrorBoundary } from "./components/ErrorBoundary";
createRoot(document.getElementById("root")!).render(<StrictMode>
    <ErrorBoundary>
<App />
</ErrorBoundary>
  </StrictMode>);
