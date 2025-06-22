import React, { useState } from "react";
import ContactSection from "./Contact/ContactSection";
import SkillsSection from "./Skill/SkillSection";
import ExpEduProjSection from "./Experience/Experience";
import { stepSchemas } from "./ValidationSchema";

const ResumeForm = ({ onGenerate, loading, initialData }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(
    initialData || {
      name: "",
      email: "",
      phone: "",
      summary: "",
      skills: [],
      experiences: [],
      education: [],
      projects: [],
      category:"",
    }
  );

  const updateFormData = (patch) => setFormData((p) => ({ ...p, ...patch }));

  /** 🔍 validate against the schema for the *current* step */
  const isCurrentStepValid = () => {
    const schema = stepSchemas[step - 1]; // array is 0‑indexed
    return schema.safeParse(formData).success;
  };

  const nextStep = () => {
    if (!isCurrentStepValid()) {
      alert("Please complete the required fields for this step.");
      return;
    }
    setStep((s) => s + 1);
  };

  const prevStep = () => setStep((s) => s - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    // final, full‑form validation (all three schemas)
    const allValid = stepSchemas.every((s) => s.safeParse(formData).success);
    if (!allValid) {
      alert("Some information is still missing or invalid.");
      return;
    }
    onGenerate(formData);
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-3xl">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Step {step} of 3
      </h2>

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <ContactSection
            data={formData}
            onNext={nextStep}
            onUpdate={updateFormData}
          />
        )}

        {step === 2 && (
          <ExpEduProjSection
            data={formData}
            onNext={nextStep}
            onPrev={prevStep}
            onUpdate={updateFormData}
          />
        )}

        {step === 3 && (
          <SkillsSection
            data={formData}
            onPrev={prevStep}
            onUpdate={updateFormData}
            onNext={() => handleSubmit(new Event("submit"))}
          />
        )}

        {step === 3 && (
          <div className="text-center mt-6">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-purple-600 text-white font-medium rounded-full shadow hover:bg-purple-700 transition-all"
            >
              {loading ? "Generating…" : "Generate Resume"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ResumeForm;
