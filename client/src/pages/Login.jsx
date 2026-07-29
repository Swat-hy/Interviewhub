import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Call AuthContext login helper which issues the API request
      await login(email, password);
      alert('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      const errorMsg = error.response?.data?.message || 'Login failed. Invalid credentials.';
      alert(errorMsg);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-sm p-8">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Login</h2>
        <p className="text-sm text-gray-500 text-center mb-8">Sign in to your account to continue</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm transition"
              required
            />
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

          <button
            type="submit"
            className="w-full py-2.5 bg-primary text-white font-semibold rounded-md hover:bg-blue-700 transition text-sm shadow-sm cursor-pointer"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-primary hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
