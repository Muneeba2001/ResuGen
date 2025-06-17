import React, { FC, useEffect } from 'react';

export interface ProjectItem {
  title: string;
  link: string;
}

interface Props {
  data: { projects: ProjectItem[] };
  onNext: () => void;
  onPrev: () => void;
  onUpdate: (sectionData: Partial<Props['data']>) => void;
}

const ProjectsSection: FC<Props> = ({ data, onNext, onPrev, onUpdate }) => {
  // Ensure at least one project is available on mount
  useEffect(() => {
    if (data.projects.length === 0) {
      onUpdate({ projects: [{ title: '', link: '' }] });
    }
  }, []);

  const updateItem = (idx: number, field: keyof ProjectItem, val: string) => {
    const updated = [...data.projects];
    (updated[idx] as any)[field] = val;
    onUpdate({ projects: updated });
  };

  const addProj = () =>
    onUpdate({ projects: [...data.projects, { title: '', link: '' }] });

  return (
    <div className="space-y-6 w-full max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-md">
      {data.projects.map((proj, i) => (
        <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            placeholder="Project Title"
            value={proj.title}
            onChange={(e) => updateItem(i, 'title', e.target.value)}
            required
            className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            placeholder="Link (optional)"
            value={proj.link}
            onChange={(e) => updateItem(i, 'link', e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      ))}

      <button
        onClick={addProj}
        type="button"
        className="text-sm text-purple-600 underline hover:text-purple-800 transition"
      >
        + Add Project
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

export default ProjectsSection;
