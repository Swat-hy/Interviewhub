import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { toast } from 'react-toastify';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [college, setCollege] = useState('');
  const [gradYear, setGradYear] = useState('');
  const [aboutMe, setAboutMe] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Call AuthContext register helper with all profile details
      await register({
        fullName: name,
        email,
        password,
        college,
        graduationYear: parseInt(gradYear),
        aboutMe
      });
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      const errorMsg = error.response?.data?.message || 'Registration failed.';
      toast.error(errorMsg);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gray-50 px-4 py-12">
      <div className="w-full max-w-lg bg-white border border-gray-200 rounded-xl shadow-sm p-8">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Register</h2>
        <p className="text-sm text-gray-500 text-center mb-8">Create a brand-new profile to join</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                placeholder="Rahul Kumar"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm transition"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                placeholder="rahul@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm transition"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm transition"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">College / Institution</label>
              <input
                type="text"
                placeholder="e.g., IIT Bombay"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm transition"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Graduation Year</label>
              <input
                type="number"
                placeholder="e.g., 2026"
                value={gradYear}
                onChange={(e) => setGradYear(e.target.value)}
                className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm transition"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">About Me</label>
            <textarea
              placeholder="Tell us a little bit about yourself, your tech stack, or interests..."
              value={aboutMe}
              onChange={(e) => setAboutMe(e.target.value)}
              rows="3"
              className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm transition"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-primary text-white font-semibold rounded-md hover:bg-blue-700 transition text-sm shadow-sm cursor-pointer"
          >
            Register Profile
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
