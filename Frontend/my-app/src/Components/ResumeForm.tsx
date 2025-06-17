import { FC, FormEvent, useState } from 'react';
import React from 'react';

/* ─────── Types ─────── */
interface ExperienceItem {
  title: string;
  company: string;
  duration: string;
}
export interface FormData {
  name: string;
  phone: string;
  email: string;
  linkedin: string;
  github: string;
  devpost: string;
  summary: string;
  programming_languages: string;
  developer_tools: string;
  libraries_frameworks: string;
  databases: string;
  experience: ExperienceItem[];
  projects: string;
  education: string;
}
interface Props {
  onGenerate: (form: FormData) => void;
  loading: boolean;
}

/* ─────── Component ─────── */
const ResumeForm: FC<Props> = ({ onGenerate, loading }) => {
  const [form, setForm] = useState<Omit<FormData, 'experience'>>({
    name: '',
    phone: '',
    email: '',
    linkedin: '',
    github: '',
    devpost: '',
    summary: '',
    programming_languages: '',
    developer_tools: '',
    libraries_frameworks: '',
    databases: '',
    projects: '',
    education: '',
  });

  const [experiences, setExperiences] = useState<ExperienceItem[]>([
    { title: '', company: '', duration: '' },
  ]);

  /* handlers */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleExpChange = (
    idx: number,
    field: keyof ExperienceItem,
    value: string
  ) => {
    const upd = [...experiences];
    upd[idx][field] = value;
    setExperiences(upd);
  };
  const addExperience = () =>
    setExperiences([...experiences, { title: '', company: '', duration: '' }]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onGenerate({ ...form, experience: experiences });
  };

  /* ─────── JSX ─────── */
  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-3xl space-y-6 rounded-2xl bg-white/60 backdrop-blur-md border border-white/30 p-8 shadow-xl"
    >
      {/* Name */}
      <input
        name="name"
        placeholder="Jane Doe"
        value={form.name}
        onChange={handleChange}
        className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm shadow-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
        required
      />

      {/* Contact */}
      {['phone', 'email', 'linkedin', 'github', 'devpost'].map((f) => (
        <input
          key={f}
          name={f}
          placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
          value={form[f as keyof typeof form]}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm shadow-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
          required
        />
      ))}

      {/* Summary */}
      <textarea
        name="summary"
        placeholder="Brief professional summary..."
        value={form.summary}
        onChange={handleChange}
        rows={3}
        className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-sm shadow-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
        required
      />

      {/* Core‑skill buckets */}
      {[
        { name: 'programming_languages', ph: 'JavaScript, C++, Python...' },
        { name: 'developer_tools', ph: 'Git, GitHub, Postman...' },
        { name: 'libraries_frameworks', ph: 'React.js, Express.js, Tailwind CSS...' },
        { name: 'databases', ph: 'MongoDB, PostgreSQL...' },
      ].map(({ name, ph }) => (
        <textarea
          key={name}
          name={name}
          placeholder={ph}
          value={form[name as keyof typeof form]}
          onChange={handleChange}
          rows={3}
          className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-sm shadow-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
          required
        />
      ))}

      {/* Experience */}
      <div className="space-y-4">
        <label className="font-semibold">Experience</label>
        {experiences.map((exp, i) => (
          <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              placeholder="Job Title"
              value={exp.title}
              onChange={(e) => handleExpChange(i, 'title', e.target.value)}
              className="rounded-lg border border-slate-300 px-4 py-3 text-sm shadow-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
              required
            />
            <input
              placeholder="Company"
              value={exp.company}
              onChange={(e) => handleExpChange(i, 'company', e.target.value)}
              className="rounded-lg border border-slate-300 px-4 py-3 text-sm shadow-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
              required
            />
            <input
              placeholder="Duration"
              value={exp.duration}
              onChange={(e) => handleExpChange(i, 'duration', e.target.value)}
              className="rounded-lg border border-slate-300 px-4 py-3 text-sm shadow-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
              required
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addExperience}
          className="text-sm text-purple-600 underline"
        >
          + Add Another Experience
        </button>
      </div>

      {/* Projects */}
      <textarea
        name="projects"
        placeholder="One line per project – e.g.  Taskify | https://github.com/you/taskify"
        value={form.projects}
        onChange={handleChange}
        rows={4}
        className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-sm shadow-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
        required
      />

      {/* Education */}
      <textarea
        name="education"
        placeholder="BS IT (2019 - 2023) | Government College University Faisalabad"
        value={form.education}
        onChange={handleChange}
        rows={2}
        className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-sm shadow-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
        required
      />

      {/* Submit */}
      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 font-semibold text-white shadow-md transition-all hover:opacity-90 disabled:opacity-60"
        disabled={loading}
      >
        {loading ? 'Generating…' : 'Generate Resume'}
      </button>
    </form>
  );
};

export default ResumeForm;
