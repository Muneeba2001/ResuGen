// components/SummarySection.tsx
import React from "react";

export default function SummarySection({ summary, onChange }) {
  return (
    <div>
      <label className="font-semibold">Professional Summary</label>
      <textarea name="summary" value={summary} onChange={onChange} rows={3} className="w-full border p-2" />
    </div>
  );
}
