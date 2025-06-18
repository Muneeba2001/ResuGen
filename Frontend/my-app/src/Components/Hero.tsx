import React, { FC } from "react";
import { ArrowDownCircle, CheckCircle, Sparkles } from "lucide-react";

interface Props {
  onBuildNowClick: () => void;
}

const Hero: FC<Props> = ({ onBuildNowClick }) => (
  <header className="min-h-screen bg-gradient-to-br from-white to-slate-100 px-6 py-20">
    <div className="max-w-screen-xl mx-auto flex flex-col lg:flex-row items-center justify-center-safe gap-10 lg:gap-20">
      {/* Text Section */}
      <div className="flex-1 text-center lg:text-left  w-1/2">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 mt-4 bg-gradient-to-r from-pink-500 via-purple-500 to-yellow-400 bg-clip-text text-transparent animate-gradient-x">
          Craft Your Resume
          <br className="hidden md:block" /> in a Minute
        </h1>

        <p className="mb-5 max-w-lg text-base md:text-xl text-slate-700 font-medium mx-auto lg:mx-0">
          An intelligent resume builder powered by advanced AI technology.
          Instantly transform your professional background into a polished,
          job-winning resume. Whether you're a student, a professional, or
          switching careers — streamline your resume creation process, save
          hours of editing, and increase your chances of landing interviews.
        </p>

        <div className="mb-6 mt-6 flex flex-col sm:flex-row gap-10 justify-center lg:justify-start text-slate-600 text-sm md:text-base">
          <div className="flex items-center gap-2">
            <CheckCircle className="text-green-500 w-5 h-5" /> AI-Powered
            Content
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="text-green-500 w-5 h-5" /> Fully
            Customizable
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="text-green-500 w-5 h-5" /> Export to PDF
          </div>
        </div>

        <button
          onClick={onBuildNowClick}
          className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-all shadow"
        >
          Build Now
        </button>

        <div className="mt-6 text-sm text-slate-500">
          <span className="flex items-center justify-center lg:justify-start gap-1">
            <Sparkles className="h-4 w-4 text-yellow-400" />
            Trusted by 10,000+ job seekers
          </span>
        </div>
      </div>

      {/* Image Section */}
      <div className="flex-1 max-w-md w-1/2">
        <img
          src="/publish-post.svg"
          alt="AI Resume Builder"
          className="w-full object-contain drop-shadow-2xl"
        />
      </div>
    </div>
  </header>
);

export default Hero;
