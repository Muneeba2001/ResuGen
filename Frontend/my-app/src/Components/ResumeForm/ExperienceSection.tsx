import React, { FC, useEffect } from 'react';

export interface ExperienceItem {
  title: string;
  company: string;
  duration: string;
}

interface Props {
  data: { experiences: ExperienceItem[] };
  onNext: () => void;
  onPrev: () => void;
  onUpdate: (sectionData: Partial<Props['data']>) => void;
}

const ExperienceSection: FC<Props> = ({ data, onNext, onPrev, onUpdate }) => {
  // Ensure at least one input shows up initially
  useEffect(() => {
    if (data.experiences.length === 0) {
      onUpdate({
        experiences: [{ title: '', company: '', duration: '' }],
      });
    }
  }, []);

  const updateItem = (idx: number, field: keyof ExperienceItem, val: string) => {
    const updated = [...data.experiences];
    updated[idx][field] = val;
    onUpdate({ experiences: updated });
  };

  const addExp = () =>
    onUpdate({
      experiences: [...data.experiences, { title: '', company: '', duration: '' }],
    });

  return (
    <div className="space-y-6 w-full max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-md">
      {data.experiences.map((exp, i) => (
        <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            placeholder="Job Title"
            value={exp.title}
            onChange={(e) => updateItem(i, 'title', e.target.value)}
            required
            className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            placeholder="Company"
            value={exp.company}
            onChange={(e) => updateItem(i, 'company', e.target.value)}
            required
            className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            placeholder="Duration"
            value={exp.duration}
            onChange={(e) => updateItem(i, 'duration', e.target.value)}
            required
            className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      ))}

      <button
        onClick={addExp}
        type="button"
        className="text-sm text-purple-600 underline hover:text-purple-800 transition"
      >
        + Add Experience
      </button>

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

export default ExperienceSection;
