import React, { useState } from 'react';
import ContactSection from './ContactSection';
import ExperienceSection from './ExperienceSection';
import ProjectsSection from './ProjectSection';
import SkillsSection from './SkillSection';
import EducationSection from './EducationSection';

const ResumeForm = ({ onGenerate, loading }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    summary: '',
    experiences: [],
    projects: [],
    skills: [],
    education: [],
  });

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const updateFormData = (sectionData) => {
    setFormData((prev) => ({ ...prev, ...sectionData }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate(formData);
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-3xl">
      <h2 className="text-2xl font-semibold mb-6 text-center">Step {step} of 5</h2>
      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <ContactSection data={formData} onNext={nextStep} onUpdate={updateFormData} />
        )}

        {step === 2 && (
          <ExperienceSection
            data={formData}
            onNext={nextStep}
            onPrev={prevStep}
            onUpdate={updateFormData}
          />
        )}

        {step === 3 && (
          <ProjectsSection
            data={formData}
            onNext={nextStep}
            onPrev={prevStep}
            onUpdate={updateFormData}
          />
        )}

        {step === 4 && (
          <SkillsSection
            data={formData}
            onNext={nextStep}
            onPrev={prevStep}
            onUpdate={updateFormData}
          />
        )}

        {step === 5 && (
          <EducationSection
            data={formData}
            onPrev={prevStep}
            onUpdate={updateFormData}
          />
        )}

        {step === 5 && (
          <div className="text-center mt-6">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-purple-600 text-white font-medium rounded-full shadow hover:bg-purple-700 transition-all"
            >
              {loading ? 'Generating...' : 'Generate Resume'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ResumeForm;