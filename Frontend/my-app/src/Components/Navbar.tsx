import React from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="fixed inset-x-0 top-0 z-50 bg-white/60 backdrop-blur-md shadow-sm border-b border-white/30 px-6 py-3 flex items-center justify-between rounded-b-2xl">
      {/* Logo Clickable */}
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-slate-800 font-bold text-xl focus:outline-none cursor-pointer"
      >
        <Sparkles className="h-6 w-6 text-purple-500" />
        ResuGen
      </button>

      {/* Get Started Button */}
      <button
        onClick={() => navigate("/how-it-works")}
        className="inline-flex items-center px-5 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium shadow hover:opacity-90 transition-all"
      >
        Get Started
      </button>
    </nav>
  );
}
