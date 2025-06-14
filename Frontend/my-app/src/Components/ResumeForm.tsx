import { FC, FormEvent, useState } from 'react';
import React from 'react';

interface Props {
  onGenerate: (form: FormData) => void;
  loading: boolean;
}

export interface FormData {
  name: string;
  phone: string;
  email: string;
  linkedin: string;
  github: string;
  devpost: string;
  summary: string;
  skills: string;
  experience: string;
  projects: string;
  education: string;
}

const ResumeForm: FC<Props> = ({ onGenerate, loading }) => {
  const [form, setForm] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    linkedin: '',
    github: '',
    devpost: '',
    summary: '',
    skills: '',
    experience: '',
    projects: '',
    education: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onGenerate(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-3xl rounded-2xl bg-white/60 backdrop-blur-md shadow-xl border border-white/30 p-8 space-y-6"
    >
      {/* Name */}
      <input
        name="name"
        placeholder="Jane Doe"
        value={form.name}
        onChange={handleChange}
        className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
        required
      />

      {/* Contact Info */}
      {['phone', 'email', 'linkedin', 'github', 'devpost'].map((field) => (
        <input
          key={field}
          name={field}
          placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
          value={form[field as keyof FormData]}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
          required
        />
      ))}

      {/* Resume Sections */}
      {['summary', 'skills', 'experience', 'projects', 'education'].map((field) => (
        <textarea
          key={field}
          name={field}
          placeholder={
            field === 'summary'
              ? 'Brief professional summary...'
              : field === 'skills'
              ? 'React, Tailwind, TypeScript...'
              : field === 'experience'
              ? 'Describe your work experience...'
              : field === 'projects'
              ? 'List your key projects...'
              : 'Add your education background...'
          }
          value={form[field as keyof FormData]}
          onChange={handleChange}
          rows={field === 'summary' || field === 'skills' ? 3 : 4}
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
          required
        />
      ))}

      {/* Submit Button */}
      <button
        type="submit"
        className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-md hover:opacity-90 transition-all disabled:opacity-60"
        disabled={loading}
      >
        {loading ? 'Generating…' : 'Generate Resume'}
      </button>
    </form>
  );
};

export default ResumeForm;
