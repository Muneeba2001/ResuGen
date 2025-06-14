import React from 'react';

const Footer = () => (
  <footer className="bg-white/70 backdrop-blur-md border-t border-white/30 text-slate-700 py-6 px-4 text-center shadow-inner">
    <p className="text-sm">
      &copy; {new Date().getFullYear()} ResuGen. Crafted with 💜 using AI.
    </p>
  </footer>
);

export default Footer;
