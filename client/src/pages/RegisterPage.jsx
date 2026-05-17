import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [role, setRole] = useState('student'); // 'student' or 'teacher'
  
  // Common Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Student Fields
  const [rollNo, setRollNo] = useState('');
  const [studentDept, setStudentDept] = useState('');

  // Teacher Fields
  const [subject, setSubject] = useState('');
  const [teacherDept, setTeacherDept] = useState('');

  const [localError, setLocalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, error: authError, setError } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setError(null);
    setLocalError('');
  }, [role, setError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setIsSubmitting(true);

    // Common Valuations
    if (!name || !email || !password || !confirmPassword) {
      setLocalError('Please fill out all common fields.');
      setIsSubmitting(false);
      return;
    }

    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters.');
      setIsSubmitting(false);
      return;
    }

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match.');
      setIsSubmitting(false);
      return;
    }

    // Role-specific fields
    const registrationData = {
      name,
      email,
      password,
      role
    };

    if (role === 'student') {
      if (!rollNo || !studentDept) {
        setLocalError('Please complete all student profile fields.');
        setIsSubmitting(false);
        return;
      }

      registrationData.roll_no = rollNo;
      registrationData.department = studentDept;
    } else {
      if (!subject || !teacherDept) {
        setLocalError('Please complete all teacher profile fields.');
        setIsSubmitting(false);
        return;
      }

      registrationData.subject = subject;
      registrationData.department = teacherDept;
    }

    try {
      const userData = await register(registrationData);
      if (userData.role === 'student') {
        navigate('/student/dashboard');
      } else {
        navigate('/teacher/dashboard');
      }
    } catch (err) {
      setLocalError(err.message || 'Registration failed.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07080c] text-[#c5c6c7] font-sans selection:bg-[#6366f1] selection:text-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background illumination bubbles */}
      <div className="absolute top-[10%] right-[10%] w-[350px] h-[350px] bg-[#6366f1]/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] left-[10%] w-[350px] h-[350px] bg-[#a855f7]/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-lg bg-[#12131a]/60 border border-gray-800/80 rounded-3xl p-8 backdrop-blur-xl shadow-2xl relative">
        <div className="absolute inset-0 rounded-3xl border border-indigo-500/10 pointer-events-none"></div>

        {/* Header */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#6366f1] to-[#a855f7] flex items-center justify-center shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="font-extrabold text-lg text-white">AssessMate</span>
          </Link>
          <h2 className="text-2xl font-bold text-white tracking-tight">Create Account</h2>
          <p className="text-gray-400 text-sm mt-1">Register to start submitting or analyzing feedback</p>
        </div>

        {/* Error notification bar */}
        {(localError || authError) && (
          <div className="mb-6 p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-300 text-sm flex items-start gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{localError || authError}</span>
          </div>
        )}

        {/* Role Toggle Switcher */}
        <div className="p-1 bg-[#1b1c24]/50 border border-gray-800 rounded-2xl flex mb-6 relative">
          <button
            type="button"
            onClick={() => setRole('student')}
            className={`flex-1 py-3 text-center rounded-xl font-bold text-sm transition-all duration-300 z-10 ${
              role === 'student' ? 'bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            I am a Student
          </button>
          <button
            type="button"
            onClick={() => setRole('teacher')}
            className={`flex-1 py-3 text-center rounded-xl font-bold text-sm transition-all duration-300 z-10 ${
              role === 'teacher' ? 'bg-gradient-to-r from-[#8b5cf6] to-[#a855f7] text-white shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            I am a Teacher
          </button>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Riya Sharma"
                className="w-full bg-[#1b1c24]/30 border border-gray-800/80 focus:border-[#6366f1]/50 focus:ring-1 focus:ring-[#6366f1]/50 rounded-xl py-3 px-4 text-white text-sm outline-none transition-all placeholder:text-gray-600"
                disabled={isSubmitting}
                required
              />
            </div>
            
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="riya@test.com"
                className="w-full bg-[#1b1c24]/30 border border-gray-800/80 focus:border-[#6366f1]/50 focus:ring-1 focus:ring-[#6366f1]/50 rounded-xl py-3 px-4 text-white text-sm outline-none transition-all placeholder:text-gray-600"
                disabled={isSubmitting}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 chars"
                className="w-full bg-[#1b1c24]/30 border border-gray-800/80 focus:border-[#6366f1]/50 focus:ring-1 focus:ring-[#6366f1]/50 rounded-xl py-3 px-4 text-white text-sm outline-none transition-all placeholder:text-gray-600"
                disabled={isSubmitting}
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
                className="w-full bg-[#1b1c24]/30 border border-gray-800/80 focus:border-[#6366f1]/50 focus:ring-1 focus:ring-[#6366f1]/50 rounded-xl py-3 px-4 text-white text-sm outline-none transition-all placeholder:text-gray-600"
                disabled={isSubmitting}
                required
              />
            </div>
          </div>

          {/* Student Specific Fields */}
          {role === 'student' && (
            <div className="pt-4 border-t border-gray-800/60 space-y-4">
              <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <span className="w-1.5 h-3 rounded-full bg-[#6366f1]"></span>
                Student Profile Information
              </h4>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Roll Number</label>
                  <input
                    type="text"
                    value={rollNo}
                    onChange={(e) => setRollNo(e.target.value)}
                    placeholder="CS2021001"
                    className="w-full bg-[#1b1c24]/30 border border-gray-800/80 focus:border-[#6366f1]/50 focus:ring-1 focus:ring-[#6366f1]/50 rounded-xl py-3 px-4 text-white text-sm outline-none transition-all placeholder:text-gray-600"
                    disabled={isSubmitting}
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Department</label>
                  <select
                    value={studentDept}
                    onChange={(e) => setStudentDept(e.target.value)}
                    className="w-full bg-[#1b1c24]/50 border border-gray-800/80 focus:border-[#6366f1]/50 focus:ring-1 focus:ring-[#6366f1]/50 rounded-xl py-3 px-4 text-white text-sm outline-none transition-all"
                    disabled={isSubmitting}
                    required
                  >
                    <option value="" disabled className="bg-[#0b0c10]">Select Department</option>
                    <option value="Computer Science" className="bg-[#0b0c10]">Computer Science</option>
                    <option value="Information Technology" className="bg-[#0b0c10]">Information Technology</option>
                    <option value="Electronics & Communication" className="bg-[#0b0c10]">Electronics & Communication</option>
                    <option value="Electrical Engineering" className="bg-[#0b0c10]">Electrical Engineering</option>
                    <option value="Mechanical Engineering" className="bg-[#0b0c10]">Mechanical Engineering</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Teacher Specific Fields */}
          {role === 'teacher' && (
            <div className="pt-4 border-t border-gray-800/60 space-y-4">
              <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <span className="w-1.5 h-3 rounded-full bg-[#a855f7]"></span>
                Teacher Instruction Information
              </h4>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Subject Taught</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Data Structures"
                    className="w-full bg-[#1b1c24]/30 border border-gray-800/80 focus:border-[#6366f1]/50 focus:ring-1 focus:ring-[#6366f1]/50 rounded-xl py-3 px-4 text-white text-sm outline-none transition-all placeholder:text-gray-600"
                    disabled={isSubmitting}
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Department</label>
                  <select
                    value={teacherDept}
                    onChange={(e) => setTeacherDept(e.target.value)}
                    className="w-full bg-[#1b1c24]/50 border border-gray-800/80 focus:border-[#6366f1]/50 focus:ring-1 focus:ring-[#6366f1]/50 rounded-xl py-3 px-4 text-white text-sm outline-none transition-all"
                    disabled={isSubmitting}
                    required
                  >
                    <option value="" disabled className="bg-[#0b0c10]">Select Department</option>
                    <option value="Computer Science" className="bg-[#0b0c10]">Computer Science</option>
                    <option value="Information Technology" className="bg-[#0b0c10]">Information Technology</option>
                    <option value="Electronics & Communication" className="bg-[#0b0c10]">Electronics & Communication</option>
                    <option value="Electrical Engineering" className="bg-[#0b0c10]">Electrical Engineering</option>
                    <option value="Mechanical Engineering" className="bg-[#0b0c10]">Mechanical Engineering</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-6 py-3.5 rounded-xl font-bold bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#a855f7] hover:brightness-110 active:brightness-95 text-white shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/25 transition-all duration-250 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Already registered?{' '}
          <Link to="/login" className="text-[#6366f1] hover:underline font-semibold transition-all">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
