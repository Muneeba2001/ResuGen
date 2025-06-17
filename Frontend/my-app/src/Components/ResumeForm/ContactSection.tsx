import React, { FC, ChangeEvent } from 'react';

interface Props {
  data: {
    name: string;
    email: string;
    phone: string;
    summary: string;
    linkedin?: string;
    github?: string;
    devpost?: string;
  };
  onNext: () => void;
  onUpdate: (sectionData: Partial<Props['data']>) => void;
}

const ContactSection: FC<Props> = ({ data, onNext, onUpdate }) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    onUpdate({ [e.target.name]: e.target.value });

  const inputStyles =
    "w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500";
  const labelStyles = "block text-sm font-medium text-gray-700";

  return (
    <div className="space-y-6 w-full max-w-xl mx-auto bg-white p-6 rounded-2xl shadow-lg">
      <div>
        <label className={labelStyles}>Full Name</label>
        <input
          name="name"
          placeholder="John Doe"
          value={data.name}
          onChange={handleChange}
          className={inputStyles}
          required
        />
      </div>

      <div>
        <label className={labelStyles}>Email</label>
        <input
          name="email"
          placeholder="john@example.com"
          value={data.email}
          onChange={handleChange}
          className={inputStyles}
          required
        />
      </div>

      <div>
        <label className={labelStyles}>Phone</label>
        <input
          name="phone"
          placeholder="+1234567890"
          value={data.phone}
          onChange={handleChange}
          className={inputStyles}
          required
        />
      </div>

      <div>
        <label className={labelStyles}>Professional Summary</label>
        <textarea
          name="summary"
          placeholder="Brief professional overview..."
          value={data.summary}
          onChange={handleChange}
          rows={3}
          className={inputStyles}
          required
        />
      </div>

      {/* Optional Fields */}
      <div>
        <label className={labelStyles}>LinkedIn (optional)</label>
        <input
          name="linkedin"
          placeholder="https://linkedin.com/in/yourprofile"
          value={data.linkedin || ''}
          onChange={handleChange}
          className={inputStyles}
        />
      </div>

      <div>
        <label className={labelStyles}>GitHub (optional)</label>
        <input
          name="github"
          placeholder="https://github.com/yourusername"
          value={data.github || ''}
          onChange={handleChange}
          className={inputStyles}
        />
      </div>

      <div>
        <label className={labelStyles}>Devpost (optional)</label>
        <input
          name="devpost"
          placeholder="https://devpost.com/yourprofile"
          value={data.devpost || ''}
          onChange={handleChange}
          className={inputStyles}
        />
      </div>

      <div className="flex justify-end">
        <button
          onClick={onNext}
          className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition-all"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ContactSection;
