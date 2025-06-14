import { FC } from 'react';
import React from 'react';

interface Props {
  markdown: string;
  formData: any; 
}

const ResumePreview: FC<Props> = ({ markdown, formData }) => {
  const handleDownloadPDF = async () => {
    try {
      const res = await fetch("http://localhost:8000/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "resume.pdf";
      a.click();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download PDF", err);
    }
  };

  return (
    <div className="flex flex-col items-center w-full h-full p-4 overflow-auto bg-slate-100">
      <div
        className="bg-white shadow-xl border border-slate-300 rounded-sm mb-4"
        style={{
          width: "794px",
          height: "1123px",
          padding: "36px 50px",
          overflowY: "auto",
          fontFamily: "Arial, sans-serif",
          lineHeight: 1.6,
        }}
      >
        {markdown ? (
          <div dangerouslySetInnerHTML={{ __html: markdown }} />
        ) : (
          <p className="text-center opacity-60">Your AI‑crafted resume will appear here.</p>
        )}
      </div>

      <button
        onClick={handleDownloadPDF}
        className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow hover:opacity-90 transition-all"
      >
        Download as PDF
      </button>
    </div>
  );
};

export default ResumePreview;