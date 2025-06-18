// ExpEduProjSection.tsx
import React, { FC, useEffect } from "react";
import { ExpEduProjFormData } from "./Schema";

interface Props {
  data: ExpEduProjFormData;
  onUpdate: (updated: Partial<ExpEduProjFormData>) => void;
  onPrev: () => void;
  onNext: () => void;
}

const ExpEduProjSection: FC<Props> = ({ data, onUpdate, onPrev, onNext }) => {
  useEffect(() => {
    if (data.experiences.length === 0) {
      onUpdate({ experiences: [{ title: "", company: "", duration: "" }] });
    }
    if (data.education.length === 0) {
      onUpdate({ education: [{ degree: "", institution: "", year: "" }] });
    }
  }, []);

  const updateItem = (
    type: keyof ExpEduProjFormData,
    idx: number,
    field: string,
    value: string
  ) => {
    const updatedList = [...(data[type] || [])];
    (updatedList[idx] as any)[field] = value;
    onUpdate({ [type]: updatedList });
  };

  const addItem = (type: keyof ExpEduProjFormData, item: any) => {
    const updatedList = [...(data[type] || []), item];
    onUpdate({ [type]: updatedList });
  };

  const inputStyles =
    "w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="space-y-8 w-full max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-md">
      {/* Experience */}
      <div>
        <label className="block text-lg font-semibold mb-2">Experience</label>
        {data.experiences.map((exp, i) => (
          <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
            <input
              placeholder="Title"
              value={exp.title}
              onChange={(e) => updateItem("experiences", i, "title", e.target.value)}
              required
              className={inputStyles}
            />
            <input
              placeholder="Company"
              value={exp.company}
              onChange={(e) => updateItem("experiences", i, "company", e.target.value)}
              required
              className={inputStyles}
            />
            <input
              placeholder="Duration"
              value={exp.duration}
              onChange={(e) => updateItem("experiences", i, "duration", e.target.value)}
              required
              className={inputStyles}
            />
          </div>
        ))}
        <button
          onClick={() =>
            addItem("experiences", { title: "", company: "", duration: "" })
          }
          className="text-sm text-blue-600 underline hover:text-blue-800"
        >
          + Add Experience
        </button>
      </div>

      {/* Education */}
      <div>
        <label className="block text-lg font-semibold mb-2">Education</label>
        {data.education.map((edu, i) => (
          <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
            <input
              placeholder="Degree"
              value={edu.degree}
              onChange={(e) => updateItem("education", i, "degree", e.target.value)}
              required
              className={inputStyles}
            />
            <input
              placeholder="Institution"
              value={edu.institution}
              onChange={(e) =>
                updateItem("education", i, "institution", e.target.value)
              }
              required
              className={inputStyles}
            />
            <input
              placeholder="Year"
              value={edu.year}
              onChange={(e) => updateItem("education", i, "year", e.target.value)}
              required
              className={inputStyles}
            />
          </div>
        ))}
        <button
          onClick={() =>
            addItem("education", { degree: "", institution: "", year: "" })
          }
          className="text-sm text-blue-600 underline hover:text-blue-800"
        >
          + Add Education
        </button>
      </div>

      {/* Projects (optional) */}
      <div>
        <label className="block text-lg font-semibold mb-2">Projects (Optional)</label>
        {(data.projects || []).map((proj, i) => (
          <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
            <input
              placeholder="Title"
              value={proj.title}
              onChange={(e) => updateItem("projects", i, "title", e.target.value)}
              required
              className={inputStyles}
            />
            <input
              placeholder="Link (optional)"
              value={proj.link}
              onChange={(e) => updateItem("projects", i, "link", e.target.value)}
              className={inputStyles}
            />
          </div>
        ))}
        <button
          onClick={() => addItem("projects", { title: "", link: "" })}
          className="text-sm text-blue-600 underline hover:text-blue-800"
        >
          + Add Project
        </button>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <button
          type="button"
          onClick={onPrev}
          className="px-6 py-2 rounded-xl border border-gray-400 text-gray-700 hover:bg-gray-100 transition"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          className="px-6 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ExpEduProjSection;
