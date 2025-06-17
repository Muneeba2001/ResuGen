import React from 'react';
import { FileText, Settings, Download } from 'lucide-react';

interface Props {
  onStartBuilding: () => void;
}

export default function HowItWorks({ onStartBuilding }: Props) {
  return (
    <div className="min-h-screen bg-slate-50 px-6 py-24 flex flex-col items-center text-center">
      <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-purple-700 animate-pulse">
        🚀 How ResuGen Works
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 max-w-5xl">
        <div className="flex flex-col items-center space-y-2">
          <FileText className="w-12 h-12 text-purple-500 animate-bounce" />
          <h3 className="text-xl font-semibold">1. Fill the Form</h3>
          <p className="text-slate-600 max-w-xs">
            Enter your contact info, experience, skills, and education details.
          </p>
        </div>

        <div className="flex flex-col items-center space-y-2">
          <Settings className="w-12 h-12 text-pink-500 animate-spin" />
          <h3 className="text-xl font-semibold">2. Let AI Generate</h3>
          <p className="text-slate-600 max-w-xs">
            Our engine turns your data into a clean, professional resume.
          </p>
        </div>

        <div className="flex flex-col items-center space-y-2">
          <Download className="w-12 h-12 text-green-500 animate-bounce" />
          <h3 className="text-xl font-semibold">3. Preview & Download</h3>
          <p className="text-slate-600 max-w-xs">
            Instantly preview your resume and download it as a PDF.
          </p>
        </div>
      </div>

      <button
        onClick={onStartBuilding}
        className="mt-12 px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-medium shadow hover:opacity-90 transition-all"
      >
        Start Building
      </button>
    </div>
  );
}
