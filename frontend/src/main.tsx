import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css"
import App from "./app/App";
import { AuthProvider } from "./features/auth/context/AuthContext";

import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
