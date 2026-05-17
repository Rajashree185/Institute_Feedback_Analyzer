import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  
  // Profile & Attendance State
  const [profile, setProfile] = useState(null);
  const [attendance, setAttendance] = useState(100.0);
  const [attendanceInput, setAttendanceInput] = useState('100');
  const [isUpdatingAttendance, setIsUpdatingAttendance] = useState(false);
  const [attendanceSuccess, setAttendanceSuccess] = useState(false);

  // Feedback Form State
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [rating, setRating] = useState(0);
  const [remarks, setRemarks] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // NLP Sentiment Analysis Success Modal/Banner State
  const [sentimentResult, setSentimentResult] = useState(null);

  // Feedback History State
  const [feedbackHistory, setFeedbackHistory] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  // Initial Fetch Data
  useEffect(() => {
    fetchProfile();
    fetchTeachers();
    fetchHistory();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/student/profile');
      setProfile(response.data.profile);
      setAttendance(response.data.profile.attendance);
      setAttendanceInput(response.data.profile.attendance.toString());
    } catch (err) {
      console.error('Failed to fetch profile', err);
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await api.get('/student/teachers');
      setTeachers(response.data.teachers);
    } catch (err) {
      console.error('Failed to fetch teachers', err);
    }
  };

  const fetchHistory = async () => {
    try {
      setIsLoadingHistory(true);
      const response = await api.get('/student/feedback');
      setFeedbackHistory(response.data.feedback);
      setIsLoadingHistory(false);
    } catch (err) {
      console.error('Failed to fetch history', err);
      setIsLoadingHistory(false);
    }
  };

  // Debounced auto-save attendance logic
  useEffect(() => {
    const parsed = parseFloat(attendanceInput);
    if (!isNaN(parsed) && parsed >= 0 && parsed <= 100) {
      // Sync the live state so the star rating guardrails update instantly
      setAttendance(parsed);

      const delayDebounceFn = setTimeout(() => {
        // Only trigger sync if value actually changed from what's currently in profile
        if (profile && parsed !== profile.attendance) {
          autoSaveAttendance(parsed);
        }
      }, 700); // 700ms debounce auto-save

      return () => clearTimeout(delayDebounceFn);
    }
  }, [attendanceInput, profile]);

  const autoSaveAttendance = async (val) => {
    setIsUpdatingAttendance(true);
    setAttendanceSuccess(false);
    try {
      const response = await api.put('/student/attendance', { attendance: val });
      setIsUpdatingAttendance(false);
      setAttendanceSuccess(true);
      
      // Update profile locally to keep it in sync
      setProfile(prev => prev ? { ...prev, attendance: response.data.attendance } : null);
      
      // If attendance drops below 60% and current rating is less than 3, reset rating to 3
      if (val < 60 && rating > 0 && rating < 3) {
        setRating(3);
      }

      // Hide success notification after 2.5 seconds
      setTimeout(() => setAttendanceSuccess(false), 2500);
    } catch (err) {
      console.error('Failed to auto-save attendance', err);
      setIsUpdatingAttendance(false);
    }
  };

  // Submit Feedback
  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSentimentResult(null);

    if (!selectedTeacherId) {
      setFormError('Please select a teacher.');
      return;
    }
    if (rating === 0) {
      setFormError('Please select a star rating.');
      return;
    }
    if (!remarks.trim()) {
      setFormError('Please write your remarks.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post('/student/feedback', {
        teacher_id: parseInt(selectedTeacherId),
        rating,
        remarks: remarks.trim()
      });

      // Show NLP sentiment result modal
      setSentimentResult(response.data.feedback);
      
      // Reset Form
      setSelectedTeacherId('');
      setRating(0);
      setRemarks('');
      
      // Refresh feedback history list
      fetchHistory();
      setIsSubmitting(false);
    } catch (err) {
      setIsSubmitting(false);
      const errMsg = err.response?.data?.error || 'Failed to submit feedback.';
      setFormError(errMsg);
    }
  };

  return (
    <div className="min-h-screen bg-[#07080c] text-[#c5c6c7] font-sans selection:bg-[#6366f1] selection:text-white pb-20 relative overflow-hidden">
      {/* Background glowing gradients */}
      <div className="absolute top-0 left-[-10%] w-[50%] h-[50%] bg-[#6366f1]/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-[30%] right-[-10%] w-[50%] h-[50%] bg-[#a855f7]/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Navigation Bar */}
      <header className="border-b border-gray-900/80 bg-[#0b0c10]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#6366f1] to-[#a855f7] flex items-center justify-center shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="font-extrabold text-lg text-white">AssessMate</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-bold text-white">{user?.name}</div>
              <div className="text-[10px] text-gray-500 font-medium uppercase tracking-widest">{profile?.roll_no}</div>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 rounded-xl border border-gray-800 bg-[#12131a] text-xs font-bold text-gray-400 hover:text-white hover:border-indigo-500/20 hover:bg-gray-800/40 transition-all duration-200"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-10 grid lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Student Profile & Attendance Slider (4 cols) */}
        <section className="lg:col-span-4 space-y-6">
          {/* Profile Card */}
          <div className="bg-[#12131a]/60 border border-gray-900/60 rounded-3xl p-6 backdrop-blur-md relative overflow-hidden">
            <div className="absolute inset-0 rounded-3xl border border-indigo-500/5 pointer-events-none"></div>
            
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-1.5 h-3.5 rounded-full bg-[#6366f1]"></span>
              Student Profile
            </h3>

            {profile ? (
              <div className="space-y-4">
                <div className="p-4 bg-[#1b1c24]/50 border border-gray-800/40 rounded-2xl">
                  <div className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wider">Name</div>
                  <div className="text-sm font-bold text-white">{profile.name}</div>
                </div>

                <div className="p-4 bg-[#1b1c24]/50 border border-gray-800/40 rounded-2xl">
                  <div className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wider">Email</div>
                  <div className="text-sm font-bold text-white">{profile.email}</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-[#1b1c24]/50 border border-gray-800/40 rounded-2xl">
                    <div className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wider">Roll No</div>
                    <div className="text-sm font-bold text-white">{profile.roll_no}</div>
                  </div>
                  <div className="p-4 bg-[#1b1c24]/50 border border-gray-800/40 rounded-2xl">
                    <div className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wider">Department</div>
                    <div className="text-sm font-bold text-white leading-tight">{profile.department}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="animate-pulse space-y-4">
                <div className="h-14 bg-gray-900/60 rounded-2xl"></div>
                <div className="h-14 bg-gray-900/60 rounded-2xl"></div>
                <div className="h-14 bg-gray-900/60 rounded-2xl"></div>
              </div>
            )}
          </div>

          {/* Interactive Attendance Update Widget */}
          <div className="bg-[#12131a]/60 border border-gray-900/60 rounded-3xl p-6 backdrop-blur-md relative overflow-hidden">
            <div className="absolute inset-0 rounded-3xl border border-indigo-500/5 pointer-events-none"></div>

            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-1.5 h-3.5 rounded-full bg-[#3b82f6]"></span>
              My Current Attendance
            </h3>

            <p className="text-xs text-gray-500 mb-6 leading-relaxed">
              Attendance changes after monitoring sessions. Type your updated attendance below to auto-sync it to the database.
            </p>

            <div className="space-y-5">
              {/* Type attendance input */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Attendance Percentage (%)</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={attendanceInput}
                    onChange={(e) => {
                      setAttendanceInput(e.target.value);
                      const parsed = parseFloat(e.target.value);
                      if (!isNaN(parsed) && parsed >= 0 && parsed <= 100) {
                        setAttendance(parsed);
                      }
                    }}
                    placeholder="e.g. 75.5"
                    className="w-full bg-[#1b1c24]/30 border border-gray-800/80 focus:border-[#3b82f6]/50 focus:ring-1 focus:ring-[#3b82f6]/50 rounded-xl py-3 px-4 text-white text-base font-bold outline-none transition-all placeholder:text-gray-600"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {isUpdatingAttendance && (
                      <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider animate-pulse flex items-center gap-1.5">
                        <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Autosaving...
                      </span>
                    )}
                    {attendanceSuccess && (
                      <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider animate-fade-in flex items-center gap-1">
                        ✓ Synced
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Readout */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#12131a] to-[#1b1c24]/60 border border-gray-800/80 text-center">
                <div className={`text-3xl font-black ${attendance >= 60 ? 'text-emerald-400' : 'text-amber-500'} tracking-tight`}>
                  {isNaN(parseFloat(attendance)) ? '0.0' : parseFloat(attendance).toFixed(1)}%
                </div>
                <div className="text-[9px] text-gray-500 font-bold uppercase tracking-wider mt-1.5">
                  {attendance >= 60 ? '🟢 Eligible for Full Ratings' : '⚠️ Restricted Rating Enforced'}
                </div>
              </div>

              {/* Guardrail Status Warning Message */}
              {attendance < 60 ? (
                <div className="p-4 rounded-2xl border border-amber-500/20 bg-amber-500/10 text-amber-300 text-xs leading-relaxed flex items-start gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <span className="font-bold">Guardrail Enforced:</span> Low rating block in effect. You cannot rate teachers less than 3 stars.
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-300 text-xs leading-relaxed flex items-start gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <span className="font-bold">Fully Eligible:</span> Good standing. You may select any star rating (1 to 5) for all faculty.
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: Feedback Submission Form (8 cols) */}
        <section className="lg:col-span-8 space-y-6">
          
          {/* Sentiment Popout success modal */}
          {sentimentResult && (
            <div className="p-6 bg-gradient-to-r from-indigo-950/40 via-purple-950/40 to-pink-950/40 border border-indigo-500/30 rounded-3xl backdrop-blur-xl animate-scale-up relative">
              <button 
                onClick={() => setSentimentResult(null)} 
                className="absolute top-4 right-4 text-gray-500 hover:text-white transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              
              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Large indicator sentiment badge */}
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg shrink-0 ${
                  sentimentResult.sentiment === 'positive' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' :
                  sentimentResult.sentiment === 'negative' ? 'bg-rose-500/10 border border-rose-500/30 text-rose-400' :
                  'bg-amber-500/10 border border-amber-500/30 text-amber-400'
                }`}>
                  {sentimentResult.sentiment === 'positive' ? '🟢' : sentimentResult.sentiment === 'negative' ? '💔' : '💛'}
                </div>

                <div>
                  <h4 className="text-lg font-bold text-white mb-1">Feedback Registered!</h4>
                  <p className="text-xs text-gray-400 leading-relaxed max-w-xl">
                    Our real-time NLP core successfully analyzed your submission. Remarks were auto-classified as{' '}
                    <span className={`font-bold ${
                      sentimentResult.sentiment === 'positive' ? 'text-emerald-400' :
                      sentimentResult.sentiment === 'negative' ? 'text-rose-400' : 'text-amber-400'
                    }`}>
                      {sentimentResult.sentiment.toUpperCase()}
                    </span>{' '}
                    with a sentiment intensity score of <span className="font-bold text-white">{sentimentResult.score}</span>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Feedback Form Panel */}
          <div className="bg-[#12131a]/60 border border-gray-900/60 rounded-3xl p-8 backdrop-blur-md relative overflow-hidden">
            <div className="absolute inset-0 rounded-3xl border border-indigo-500/5 pointer-events-none"></div>

            <h3 className="text-xl font-extrabold text-white mb-6 flex items-center gap-2">
              <span className="w-1.5 h-4 rounded-full bg-gradient-to-b from-[#6366f1] to-[#a855f7]"></span>
              Submit Faculty Performance Feedback
            </h3>

            {formError && (
              <div className="mb-6 p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-300 text-xs flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleFeedbackSubmit} className="space-y-6">
              {/* Teacher Selector dropdown */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5">Select Faculty Instructor</label>
                <select
                  value={selectedTeacherId}
                  onChange={(e) => setSelectedTeacherId(e.target.value)}
                  className="w-full bg-[#1b1c24]/50 border border-gray-800/80 focus:border-[#6366f1]/50 focus:ring-1 focus:ring-[#6366f1]/50 rounded-xl py-3.5 px-4 text-white text-sm outline-none transition-all"
                  required
                >
                  <option value="" className="bg-[#0b0c10]">Choose teacher from listing...</option>
                  {teachers.map((t) => (
                    <option key={t.teacher_id} value={t.teacher_id} className="bg-[#0b0c10]">
                      {t.name} — {t.subject} ({t.department})
                    </option>
                  ))}
                </select>
              </div>

              {/* Star Rating Guardrail Component */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Performance Star Rating</label>
                <div className="flex items-center gap-3">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isLockBlocked = attendance < 60 && star < 3;

                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => {
                          if (isLockBlocked) {
                            setFormError('Attendance is below 60%. Star ratings 1 and 2 are restricted by the system guardrail.');
                            return;
                          }
                          setRating(star);
                          setFormError('');
                        }}
                        className={`w-12 h-12 rounded-xl border flex items-center justify-center text-xl transition-all duration-200 relative group ${
                          isLockBlocked 
                            ? 'bg-gray-950/40 border-gray-900 text-gray-700 cursor-not-allowed'
                            : star <= rating
                            ? 'bg-amber-500/10 border-amber-500/40 text-amber-400 shadow-md shadow-amber-500/5'
                            : 'bg-[#1b1c24]/30 border-gray-800/80 text-gray-600 hover:border-gray-700 hover:text-gray-400'
                        }`}
                      >
                        {isLockBlocked ? (
                          <span className="text-sm">🔒</span>
                        ) : (
                          <span>★</span>
                        )}

                        {/* Tooltip on hover */}
                        {isLockBlocked && (
                          <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-900 border border-gray-800 text-[10px] text-amber-500 font-bold px-2 py-1.5 rounded-lg whitespace-nowrap z-20">
                            Blocked due to low attendance
                          </div>
                        )}
                      </button>
                    );
                  })}
                  
                  {rating > 0 && (
                    <span className="text-xs font-bold text-gray-400 ml-2">
                      ({rating} out of 5 stars selected)
                    </span>
                  )}
                </div>
              </div>

              {/* Remarks Textarea */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5">Textual Performance Remarks</label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Describe your classroom learning experience. Remarks will be analyzed for keywords and sentiment scores."
                  className="w-full h-32 bg-[#1b1c24]/30 border border-gray-800/80 focus:border-[#6366f1]/50 focus:ring-1 focus:ring-[#6366f1]/50 rounded-xl p-4 text-white text-sm outline-none transition-all placeholder:text-gray-600 resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl font-bold bg-gradient-to-r from-[#6366f1] to-[#a855f7] hover:brightness-110 active:brightness-95 text-white shadow-lg shadow-indigo-600/10 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? 'Registering Feedback Remarks...' : 'Submit secure feedback evaluation'}
              </button>
            </form>
          </div>

          {/* Feedback History Table / List */}
          <div className="bg-[#12131a]/60 border border-gray-900/60 rounded-3xl p-6 backdrop-blur-md relative overflow-hidden">
            <div className="absolute inset-0 rounded-3xl border border-indigo-500/5 pointer-events-none"></div>

            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-1.5 h-3.5 rounded-full bg-[#a855f7]"></span>
              My Submitted Feedback History
            </h3>

            {isLoadingHistory ? (
              <div className="animate-pulse space-y-4">
                <div className="h-16 bg-gray-900/40 rounded-2xl"></div>
                <div className="h-16 bg-gray-900/40 rounded-2xl"></div>
              </div>
            ) : feedbackHistory.length === 0 ? (
              <div className="p-8 text-center text-sm text-gray-500 border border-dashed border-gray-800 rounded-2xl">
                No past feedback evaluations submitted yet.
              </div>
            ) : (
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
                {feedbackHistory.map((item) => (
                  <div key={item.id} className="p-5 bg-[#1b1c24]/30 border border-gray-800/60 rounded-2xl hover:border-gray-800 hover:bg-[#1b1c24]/50 transition-all duration-200">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                      <div>
                        <div className="text-sm font-bold text-white">{item.teacher_name}</div>
                        <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">{item.subject} ({item.department})</div>
                      </div>
                      
                      {/* Sentiment classification status badge */}
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border ${
                          item.sentiment === 'positive' ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' :
                          item.sentiment === 'negative' ? 'bg-rose-500/5 border-rose-500/20 text-rose-400' :
                          'bg-amber-500/5 border-amber-500/20 text-amber-400'
                        }`}>
                          {item.sentiment} ({item.score > 0 ? `+${item.score}` : item.score})
                        </span>
                        
                        <span className="text-amber-400 font-bold text-sm">
                          {'★'.repeat(item.rating)}
                          <span className="text-gray-700">{'★'.repeat(5 - item.rating)}</span>
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-[#94a3b8] leading-relaxed italic border-l border-gray-800 pl-3">
                      "{item.remarks}"
                    </p>
                    
                    <div className="text-[9px] text-gray-600 font-medium text-right mt-2">
                      Submitted on: {new Date(item.submitted_at).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

      </main>
    </div>
  );
};

export default StudentDashboard;
