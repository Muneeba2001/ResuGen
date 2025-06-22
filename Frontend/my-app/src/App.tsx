import React from "react";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import MainRoutes from "./routes/MainRoutes";

export default function App() {
  return (
    <>
      <Navbar />
      <MainRoutes />
      <Footer />
    </>
  );
}
