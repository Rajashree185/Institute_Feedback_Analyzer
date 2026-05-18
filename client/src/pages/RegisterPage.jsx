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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Student Fields
  const [rollNo, setRollNo] = useState('');
  const [studentDept, setStudentDept] = useState('');
  const [studentYear, setStudentYear] = useState('');
  const [studentSemester, setStudentSemester] = useState('');

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

  // Reset semester if year changes to something incompatible
  useEffect(() => {
    if (studentYear) {
      const yearNum = parseInt(studentYear);
      const semNum = parseInt(studentSemester);
      if (semNum && Math.ceil(semNum / 2) !== yearNum) {
        setStudentSemester('');
      }
    } else {
      setStudentSemester('');
    }
  }, [studentYear]);

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
      if (!rollNo || !studentDept || !studentYear || !studentSemester) {
        setLocalError('Please complete all student profile fields.');
        setIsSubmitting(false);
        return;
      }

      registrationData.roll_no = rollNo;
      registrationData.department = studentDept;
      registrationData.year = parseInt(studentYear);
      registrationData.semester = parseInt(studentSemester);
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
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Full Name</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Riya Sharma"
                className="w-full bg-[#1b1c24]/30 border border-gray-800/80 focus:border-[#6366f1]/50 focus:ring-1 focus:ring-[#6366f1]/50 rounded-xl py-3 pl-11 pr-4 text-white text-sm outline-none transition-all duration-200 placeholder:text-gray-600"
                disabled={isSubmitting}
                required
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@institution.edu"
                className="w-full bg-[#1b1c24]/30 border border-gray-800/80 focus:border-[#6366f1]/50 focus:ring-1 focus:ring-[#6366f1]/50 rounded-xl py-3 pl-11 pr-4 text-white text-sm outline-none transition-all duration-200 placeholder:text-gray-600"
                disabled={isSubmitting}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 chars"
                className="w-full bg-[#1b1c24]/30 border border-gray-800/80 focus:border-[#6366f1]/50 focus:ring-1 focus:ring-[#6366f1]/50 rounded-xl py-3 pl-11 pr-10 text-white text-sm outline-none transition-all duration-200 placeholder:text-gray-600"
                disabled={isSubmitting}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-500 hover:text-white transition-colors"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Confirm Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </span>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
                className="w-full bg-[#1b1c24]/30 border border-gray-800/80 focus:border-[#6366f1]/50 focus:ring-1 focus:ring-[#6366f1]/50 rounded-xl py-3 pl-11 pr-10 text-white text-sm outline-none transition-all duration-200 placeholder:text-gray-600"
                disabled={isSubmitting}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-500 hover:text-white transition-colors"
              >
                {showConfirmPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
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
                    <option value="AI/ML" className="bg-[#0b0c10]">AI/ML</option>
                    <option value="Electronics & Communication" className="bg-[#0b0c10]">Electronics & Communication</option>
                    <option value="Electrical Engineering" className="bg-[#0b0c10]">Electrical Engineering</option>
                    <option value="Mechanical Engineering" className="bg-[#0b0c10]">Mechanical Engineering</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Year</label>
                  <select
                    value={studentYear}
                    onChange={(e) => setStudentYear(e.target.value)}
                    className="w-full bg-[#1b1c24]/50 border border-gray-800/80 focus:border-[#6366f1]/50 focus:ring-1 focus:ring-[#6366f1]/50 rounded-xl py-3 px-4 text-white text-sm outline-none transition-all"
                    disabled={isSubmitting}
                    required
                  >
                    <option value="" disabled className="bg-[#0b0c10]">Select Year</option>
                    <option value="1" className="bg-[#0b0c10]">1st Year</option>
                    <option value="2" className="bg-[#0b0c10]">2nd Year</option>
                    <option value="3" className="bg-[#0b0c10]">3rd Year</option>
                    <option value="4" className="bg-[#0b0c10]">4th Year</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Semester</label>
                  <select
                    value={studentSemester}
                    onChange={(e) => setStudentSemester(e.target.value)}
                    className="w-full bg-[#1b1c24]/50 border border-gray-800/80 focus:border-[#6366f1]/50 focus:ring-1 focus:ring-[#6366f1]/50 rounded-xl py-3 px-4 text-white text-sm outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting || !studentYear}
                    required
                  >
                    <option value="" disabled className="bg-[#0b0c10]">
                      {!studentYear ? 'Select Year First' : 'Select Semester'}
                    </option>
                    {studentYear === '1' && (
                      <>
                        <option value="1" className="bg-[#0b0c10]">1st Semester</option>
                        <option value="2" className="bg-[#0b0c10]">2nd Semester</option>
                      </>
                    )}
                    {studentYear === '2' && (
                      <>
                        <option value="3" className="bg-[#0b0c10]">3rd Semester</option>
                        <option value="4" className="bg-[#0b0c10]">4th Semester</option>
                      </>
                    )}
                    {studentYear === '3' && (
                      <>
                        <option value="5" className="bg-[#0b0c10]">5th Semester</option>
                        <option value="6" className="bg-[#0b0c10]">6th Semester</option>
                      </>
                    )}
                    {studentYear === '4' && (
                      <>
                        <option value="7" className="bg-[#0b0c10]">7th Semester</option>
                        <option value="8" className="bg-[#0b0c10]">8th Semester</option>
                      </>
                    )}
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
                    <option value="AI/ML" className="bg-[#0b0c10]">AI/ML</option>
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
