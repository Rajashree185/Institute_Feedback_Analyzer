import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#0b0c10] text-[#c5c6c7] font-sans selection:bg-[#6366f1] selection:text-white overflow-hidden relative">
      {/* Background ambient lighting effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#6366f1]/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#a855f7]/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Header / Navbar */}
      <header className="border-b border-gray-800/40 backdrop-blur-md sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6366f1] to-[#a855f7] flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400">
              AssessMate
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              to="/login" 
              className="px-5 py-2.5 rounded-xl font-medium text-sm text-[#94a3b8] hover:text-white transition-all duration-200"
            >
              Sign In
            </Link>
            <Link 
              to="/register" 
              className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white hover:brightness-110 shadow-lg shadow-indigo-500/15 hover:shadow-indigo-500/25 hover:translate-y-[-1px] transition-all duration-200"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-20 pb-32 relative">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/5 text-xs text-[#a5b4fc] font-semibold mb-8 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
            Advanced Analytics Engine
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-8 leading-[1.1] bg-clip-text text-transparent bg-gradient-to-b from-white via-slate-100 to-slate-400">
            Intelligent Academic Feedback
            <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-[#6366f1] via-[#a855f7] to-[#ec4899] animate-gradient-xy">
              Powered by Sentimental NLP
            </span>
          </h1>

          <p className="text-lg md:text-xl text-[#94a3b8] mb-12 max-w-2xl mx-auto leading-relaxed">
            Bridge the gap between faculty ratings and actionable insights. AssessMate enforces visual and logical attendance-based guardrails for integrity while utilizing lightning-fast offline sentiment analysis.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#a855f7] shadow-xl shadow-indigo-600/20 hover:shadow-indigo-600/30 hover:brightness-110 hover:translate-y-[-2px] active:translate-y-[0px] transition-all duration-300 flex items-center justify-center gap-2"
            >
              Start Free Registration
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
            
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold border border-gray-800 bg-gray-900/40 backdrop-blur-sm text-white hover:bg-gray-800/60 hover:border-indigo-500/30 hover:translate-y-[-2px] active:translate-y-[0px] transition-all duration-300 flex items-center justify-center"
            >
              Sign In to Your Portal
            </Link>
          </div>
        </div>

        {/* Features / Modules Section */}
        <div className="grid md:grid-cols-3 gap-8 pt-12">
          {/* Card 1 - Guardrail */}
          <div className="bg-[#12131a]/60 border border-gray-800/60 p-8 rounded-3xl backdrop-blur-md hover:border-indigo-500/20 hover:bg-[#12131a]/80 hover:translate-y-[-4px] transition-all duration-300 relative group overflow-hidden">
            <div className="absolute top-[-20%] right-[-20%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[40px] pointer-events-none group-hover:bg-indigo-500/20 transition-all duration-300"></div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Attendance Guardrails</h3>
            <p className="text-gray-400 leading-relaxed">
              Enforce fairness. Students with poor attendance (&lt; 60%) are prohibited from submitting low ratings (&lt; 3), secured at both frontend UI and API layers.
            </p>
          </div>

          {/* Card 2 - NLP Sentiment */}
          <div className="bg-[#12131a]/60 border border-gray-800/60 p-8 rounded-3xl backdrop-blur-md hover:border-purple-500/20 hover:bg-[#12131a]/80 hover:translate-y-[-4px] transition-all duration-300 relative group overflow-hidden">
            <div className="absolute top-[-20%] right-[-20%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[40px] pointer-events-none group-hover:bg-purple-500/20 transition-all duration-300"></div>
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Offline Sentiment NLP</h3>
            <p className="text-gray-400 leading-relaxed">
              Utilize lightning-fast AFINN-111 lexicographical mapping to translate textual remarks into sentiment counts, scores, and positive/negative keywords.
            </p>
          </div>

          {/* Card 3 - RBAC */}
          <div className="bg-[#12131a]/60 border border-gray-800/60 p-8 rounded-3xl backdrop-blur-md hover:border-pink-500/20 hover:bg-[#12131a]/80 hover:translate-y-[-4px] transition-all duration-300 relative group overflow-hidden">
            <div className="absolute top-[-20%] right-[-20%] w-[40%] h-[40%] bg-pink-500/10 rounded-full blur-[40px] pointer-events-none group-hover:bg-pink-500/20 transition-all duration-300"></div>
            <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Separated Teacher/Student Portals</h3>
            <p className="text-gray-400 leading-relaxed">
              Ensure strict data isolation. Teachers get aggregate NLP sentiment dashboards, and students get attendance-aware entry modules and feedback histories.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-900/60 bg-[#07080c] py-8 text-center text-sm text-gray-600">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} AssessMate. All Rights Reserved.</p>
          <div className="flex gap-6 text-gray-500">
            <span>Secure & offline</span>
            <span>Final Year Project Submission</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
