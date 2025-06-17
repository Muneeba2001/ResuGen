import React, { useState } from "react";
import Navbar from "./Components/Navbar";
import Hero from "./Components/Hero";
import HowItWorks from "./Components/HowItWorks";
import ResumeBuilder from "./Components/ResumeBuilder";
import Footer from "./Components/Footer";

type Page = "home" | "how-it-works" | "builder";

export default function App() {
  const [page, setPage] = useState<Page>("home");

  return (
    <>
      <Navbar
        onGetStartedClick={() => setPage("how-it-works")}
        onLogoClick={() => setPage("home")}
      />

      {page === "home" && (
        <>
          <Hero onBuildNowClick={() => setPage("how-it-works")} />
        </>
      )}

      {page === "how-it-works" && (
        <HowItWorks onStartBuilding={() => setPage("builder")} />
      )}

      {page === "builder" && (
        <ResumeBuilder onBackHome={() => setPage("home")} />
      )}

      <Footer />
    </>
  );
}
