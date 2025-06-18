import React, { FC, ChangeEvent, useEffect, useState } from "react";

interface Props {
  data: { skills: string[] };
  onNext: () => void;
  onPrev: () => void;
  onUpdate: (section: Partial<Props["data"]>) => void;
}

const SkillsSection: FC<Props> = ({ data, onNext, onPrev, onUpdate }) => {
  // Local uncontrolled string to let the user type freely
  const [inputStr, setInputStr] = useState<string>(data.skills.join(", "));

  /* keep local string in sync if parent updates skills from elsewhere */
  useEffect(() => {
    setInputStr(data.skills.join(", "));
  }, [data.skills]);

  // Update both local string & array (but keep empties while typing)
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputStr(value);

    const arr = value
      .split(",")
      .map((s) => s.trimStart()); // keep trailing item even if empty
    onUpdate({ skills: arr.filter((s) => s.trim() !== "") }); // parent gets clean list
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-md space-y-6">
      <div>
        <label className="block text-lg font-medium text-gray-800 mb-2">
          Skills
        </label>

        <input
          type="text"
          placeholder="Comma‑separated (e.g., React, Tailwind, Node.js)"
          value={inputStr}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <p className="text-sm text-gray-500 mt-1">
          Enter your skills separated by commas.
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
