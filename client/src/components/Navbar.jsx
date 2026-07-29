import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand Logo */}
          <div className="flex-shrink-0">
            <Link 
              to="/" 
              className="text-2xl font-bold text-primary tracking-tight hover:opacity-90 transition"
            >
              InterviewHub
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <Link
              to="/search"
              className="text-gray-600 hover:text-primary text-sm font-medium transition"
            >
              Explore
            </Link>
            {user ? (
              <>
                <Link
                  to="/add-experience"
                  className="text-gray-600 hover:text-primary text-sm font-medium transition"
                >
                  Share Experience
                </Link>
                <Link
                  to="/questions"
                  className="text-gray-600 hover:text-primary text-sm font-medium transition"
                >
                  Questions
                </Link>
                <Link
                  to="/dashboard"
                  className="text-gray-600 hover:text-primary text-sm font-medium transition"
                >
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 text-sm font-semibold transition hover:opacity-90 cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-primary text-sm font-medium transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700 text-sm font-semibold transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
