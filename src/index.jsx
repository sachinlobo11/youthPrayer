import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css"; // Tailwind styles
import BibleStudyLMS from "./BibleStudyLMS";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { registerSW } from "virtual:pwa-register";


import AIChatPage from "./pages/AIChatPage";


registerSW({ immediate: true });



const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  
  <React.StrictMode>
    <Router>
      <Routes>
        {/* Homepage (your main LMS) */}
        <Route path="/" element={<BibleStudyLMS />} />

        {/* AI Chat page */}
        <Route path="/ai-chat" element={<AIChatPage />} />
      </Routes>
    </Router>
  </React.StrictMode>
);