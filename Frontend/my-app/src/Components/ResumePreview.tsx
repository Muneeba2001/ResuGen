import React, { FC } from "react";

interface Props {
  html: string;
  formData: any;
  onUpdate: () => void;
}

const ResumePreview: FC<Props> = ({ html, formData, onUpdate }) => {
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
    <div className="flex flex-col items-center w-full min-h-screen bg-slate-100 py-10 px-4">
      <div
        className="bg-white shadow-xl border border-slate-300 rounded-sm mb-6 overflow-y-auto"
        style={{ width: "794px", height: "1123px", padding: "36px 50px" }}
      >
        {html ? (
          <div dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          <p className="text-center opacity-60">
            Your AI‑crafted resume will appear here.
          </p>
        )}
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleDownloadPDF}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow hover:opacity-90 transition"
        >
          Download as PDF
        </button>

        <button
          onClick={onUpdate}
          className="px-6 py-3 bg-gray-300 text-gray-800 rounded-full shadow hover:bg-gray-400 transition"
        >
          Update Resume
        </button>
      </div>
    </div>
  );
};

export default ResumePreview;
