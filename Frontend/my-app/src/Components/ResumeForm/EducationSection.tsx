import React, { FC, useEffect } from 'react';

export interface EducationItem {
  degree: string;
  institution: string;
  year: string;
}

interface Props {
  data: { education: EducationItem[] };
  onPrev: () => void;
  onUpdate: (sectionData: Partial<Props['data']>) => void;
}

const EducationSection: FC<Props> = ({ data, onPrev, onUpdate }) => {
  /* Ensure at least one empty education row is present */
  useEffect(() => {
    if (data.education.length === 0) {
      onUpdate({ education: [{ degree: '', institution: '', year: '' }] });
    }
  }, []);

  const updateItem = (idx: number, field: keyof EducationItem, val: string) => {
    const updated = [...data.education];
    updated[idx][field] = val;
    onUpdate({ education: updated });
  };

  const addEdu = () =>
    onUpdate({
      education: [...data.education, { degree: '', institution: '', year: '' }],
    });

  return (
    <div className="w-full max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-md space-y-8">
      <div>
        <label className="block text-lg font-medium text-gray-800 mb-4">
          Education
        </label>

        {/* list with vertical gap between rows */}
        <div className="space-y-4">
          {data.education.map((edu, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                placeholder="Degree"
                value={edu.degree}
                onChange={(e) => updateItem(i, 'degree', e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <input
                placeholder="Institution"
                value={edu.institution}
                onChange={(e) => updateItem(i, 'institution', e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <input
                placeholder="Year"
                value={edu.year}
                onChange={(e) => updateItem(i, 'year', e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          ))}
        </div>

        <button
          onClick={addEdu}
          type="button"
          className="mt-4 text-sm text-blue-600 underline hover:text-blue-800 transition"
        >
          + Add Education
        </button>

        <div className="flex justify-start pt-6">
          <button
            type="button"
            onClick={onPrev}
            className="px-6 py-2 rounded-xl border border-gray-400 text-gray-700 hover:bg-gray-100 transition"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default EducationSection;
