import React, { FC, ChangeEvent } from 'react';

interface Props {
  data: { skills: string[] };
  onNext: () => void;
  onPrev: () => void;
  onUpdate: (sectionData: Partial<Props['data']>) => void;
}

const SkillsSection: FC<Props> = ({ data, onNext, onPrev, onUpdate }) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    onUpdate({ skills: e.target.value.split(',').map((s) => s.trim()) });

  return (
    <div className="w-full max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-md space-y-6">
      <div>
        <label className="block text-lg font-medium text-gray-800 mb-2">
          Skills
        </label>
        <input
          placeholder="Comma-separated (e.g., React, Tailwind, Node)"
          value={data.skills.join(', ')}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
        />
        <p className="text-sm text-gray-500 mt-1">
          Enter skills separated by commas.
        </p>
      </div>

      <div className="flex justify-between">
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

export default SkillsSection;
