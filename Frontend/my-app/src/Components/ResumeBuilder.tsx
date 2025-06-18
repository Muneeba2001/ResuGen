import React, { useState } from "react";
import ResumeForm from "./ResumeForm/ResumeForm";
import ResumePreview from "./ResumePreview";

type Page = "form" | "preview";

interface Props {
  onBackHome: () => void;
}

export default function ResumeBuilder({ onBackHome }: Props) {
  const [page, setPage] = useState<Page>("form");
  const [loading, setLoading] = useState(false);
  const [html, setHtml] = useState("");
  const [formData, setFormData] = useState<any>(null);

  const generateResume = async (form: any) => {
    setLoading(true);
    setFormData(form);

    try {
      const res = await fetch("http://localhost:8000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const { html } = await res.json();
      setHtml(html);
      setPage("preview");
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-10 bg-slate-50 py-20 px-6 flex flex-col items-center min-h-screen">
      {page === "form" && (
        <ResumeForm
          onGenerate={generateResume}
          loading={loading}
          initialData={formData}
        />
      )}

      {page === "preview" && formData && (
        <ResumePreview
          html={html}
          formData={formData}
          onUpdate={() => setPage("form")}
        />
      )}

      {/* Spinner overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <svg
            className="animate-spin h-12 w-12 text-white"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
        </div>
      )}
    </div>
  );
}
