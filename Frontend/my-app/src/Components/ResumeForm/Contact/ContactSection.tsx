import React, { FC, ChangeEvent, useState } from 'react';
import { contactSchema } from './Schema'; 

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
  const [errors, setErrors] = useState<Partial<Record<keyof Props['data'], string>>>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onUpdate({ [e.target.name]: e.target.value });
  };

  const handleNextClick = () => {
    const parsed = contactSchema.safeParse(data);
    if (!parsed.success) {
      const fieldErrors: typeof errors = {};
      parsed.error.errors.forEach((err) => {
        const field = err.path[0] as keyof Props['data'];
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
    } else {
      setErrors({});
      onNext();
    }
  };

  const inputStyles = "w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500";
  const labelStyles = "block text-sm font-medium text-gray-700";
  const errorStyles = "text-red-500 text-sm mt-1";

  return (
    <div className="space-y-6 w-full max-w-xl mx-auto bg-white p-6 rounded-2xl shadow-lg">
      {[
        { label: 'Full Name', name: 'name', placeholder: 'John Doe', type: 'text' },
        { label: 'Email', name: 'email', placeholder: 'john@example.com', type: 'email' },
        { label: 'Phone', name: 'phone', placeholder: '+1234567890', type: 'tel' },
        { label: 'LinkedIn (optional)', name: 'linkedin', placeholder: 'https://linkedin.com/in/yourprofile', type: 'url' },
        { label: 'GitHub (optional)', name: 'github', placeholder: 'https://github.com/yourusername', type: 'url' },
        { label: 'Devpost (optional)', name: 'devpost', placeholder: 'https://devpost.com/yourprofile', type: 'url' },
      ].map(({ label, name, placeholder, type }) => (
        <div key={name}>
          <label className={labelStyles}>{label}</label>
          <input
            name={name}
            type={type}
            placeholder={placeholder}
            value={data[name as keyof Props['data']] || ''}
            onChange={handleChange}
            className={inputStyles}
          />
          {errors[name as keyof Props['data']] && (
            <p className={errorStyles}>{errors[name as keyof Props['data']]}</p>
          )}
        </div>
      ))}

      <div>
        <label className={labelStyles}>Professional Summary</label>
        <textarea
          name="summary"
          placeholder="Brief professional overview..."
          value={data.summary}
          onChange={handleChange}
          rows={3}
          className={inputStyles}
        />
        {errors.summary && <p className={errorStyles}>{errors.summary}</p>}
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleNextClick}
          className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition-all"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ContactSection;
