import { useRef, useState } from 'react';
import React from 'react';
import Navbar from './Components/Navbar';
import Hero from './Components/Hero';
import ResumeForm, { FormData } from './Components/ResumeForm';
import ResumePreview from './Components/ResumePreview';
import Footer from './Components/Footer';

function App() {
  const [loading, setLoading] = useState(false);
  const [markdown, setMarkdown] = useState('');
  const [formData, setFormData] = useState<FormData | null>(null);
  const buildRef = useRef<HTMLDivElement>(null);

  const scrollToBuild = () => {
    buildRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateResume = async (form: FormData) => {
    setLoading(true);
    setFormData(form);
    try {
      const res = await fetch('http://localhost:8000/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const { html } = await res.json();
      setMarkdown(html);
    } catch (err) {
      console.error(err);
      alert('Something went wrong. Try again!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar onGetStartedClick={scrollToBuild} />
      <Hero onBuildNowClick={scrollToBuild} />

      <div
        ref={buildRef}
        className="relative z-10 bg-slate-50 py-20 px-6 flex flex-col items-center justify-center"
      >
        <ResumeForm onGenerate={generateResume} loading={loading} />

        {formData && (
          <div className="mt-12 w-full flex justify-center">
            <ResumePreview markdown={markdown} formData={formData} />
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}

export default App;
