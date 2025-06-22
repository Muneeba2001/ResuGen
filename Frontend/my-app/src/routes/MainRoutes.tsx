import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Hero from "../Components/Hero";
import HowItWorks from "../Components/HowItWorks";
import ResumeBuilder from "../Components/ResumeBuilder";

export default function MainRoutes() {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route
        path="/"
        element={<Hero onBuildNowClick={() => navigate("/how-it-works")} />}
      />
      <Route
        path="/how-it-works"
        element={<HowItWorks onStartBuilding={() => navigate("/builder")} />}
      />
      <Route
        path="/builder"
        element={<ResumeBuilder onBackHome={() => navigate("/")} />}
      />
    </Routes>
  );
}
