import React from 'react';
import { useAuth } from '../context/AuthContext';

const SentimentReport = () => {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-[#07080c] text-white flex flex-col items-center justify-center p-6 text-center">
      <h2 className="text-3xl font-extrabold mb-2 text-white">NLP Sentiment Report</h2>
      <p className="text-gray-400 max-w-sm mb-4">Welcome {user?.name}. Teacher report analytics will load in Phase 6.</p>
    </div>
  );
};

export default SentimentReport;
