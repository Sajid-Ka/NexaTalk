import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css"
import App from "./app/App";
import { BrowserRouter } from "react-router-dom";
import Providers from "./app/provider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Providers>
        <App />
      </Providers>
    </BrowserRouter>
   </StrictMode>, 
);
