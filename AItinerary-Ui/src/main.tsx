import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";
import App from "./App.tsx";
import Home from "./Home.tsx";
import About from "./About.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <StrictMode>
      <Routes>
        <Route index element={<Home />} />
        <Route path="chat" element={<App />} />
        <Route path="about" element={<About />} />
      </Routes>
    </StrictMode>
  </BrowserRouter>
);
