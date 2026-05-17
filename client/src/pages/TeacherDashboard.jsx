import React from 'react';
import { useAuth } from '../context/AuthContext';

const TeacherDashboard = () => {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen bg-[#07080c] text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-6 animate-pulse">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 9.172V5L8 4z" />
        </svg>
      </div>
      <h2 className="text-3xl font-extrabold mb-2 text-white">Teacher Dashboard</h2>
      <p className="text-gray-400 max-w-sm mb-8">Welcome {user?.name}. Your teacher portal will load in Phase 6.</p>
      <button onClick={logout} className="px-6 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-sm hover:bg-gray-800 transition-all font-bold">
        Log Out
      </button>
    </div>
  );
};

export default TeacherDashboard;
