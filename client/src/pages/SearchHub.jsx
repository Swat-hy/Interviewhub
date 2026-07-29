import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api.js';

const SearchHub = () => {
  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [difficulty, setDifficulty] = useState('All');
  const [mode, setMode] = useState('All');
  const [result, setResult] = useState('All');
  const [year, setYear] = useState('All');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'oldest'
  
  // Database experiences storage states
  const [experiences, setExperiences] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. Fetch approved experiences when component mounts
  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setLoading(true);
        const response = await api.get('/experiences');
        setExperiences(response.data);
      } catch (error) {
        console.error('Error fetching experiences:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchExperiences();
  }, []);

  // 3. Process search filters locally on the database payload state array
  useEffect(() => {
    let results = [...experiences];

    // 1. Text Search Filter (Company, Role, or College)
    if (searchTerm.trim() !== '') {
      const query = searchTerm.toLowerCase();
      results = results.filter(
        (item) =>
          item.companyName.toLowerCase().includes(query) ||
          item.jobRole.toLowerCase().includes(query) ||
          (item.user?.college && item.user.college.toLowerCase().includes(query))
      );
    }

    // 2. Dropdown Filters
    if (difficulty !== 'All') {
      results = results.filter((item) => item.difficulty === difficulty);
    }
    if (mode !== 'All') {
      results = results.filter((item) => item.interviewMode === mode);
    }
    if (result !== 'All') {
      results = results.filter((item) => item.result === result);
    }
    if (year !== 'All') {
      results = results.filter((item) => item.user?.graduationYear === parseInt(year));
    }

    // 3. Sorting
    results.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });

    setFilteredData(results);
  }, [experiences, searchTerm, difficulty, mode, result, year, sortBy]);

  const getDifficultyColor = (diff) => {
    switch (diff) {
      case 'Easy':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'Medium':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Hard':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getResultColor = (res) => {
    switch (res) {
      case 'Selected':
        return 'bg-emerald-50 text-accent border-emerald-200';
      case 'Rejected':
        return 'bg-rose-50 text-rose-600 border-rose-200';
      default:
        return 'bg-amber-50 text-amber-600 border-amber-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 min-h-screen">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Experience Hub</h1>
        <p className="text-sm text-gray-500 mt-2">Filter and browse through real interview logs shared by candidates.</p>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Lateral Filter Sidebar */}
        <aside className="lg:col-span-1 bg-white border border-gray-200 rounded-xl p-6 shadow-sm self-start space-y-6">
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Sidebar Filters</h3>
            
            {/* Difficulty Dropdown */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-200 rounded-md outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              >
                <option value="All">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            {/* Mode Dropdown */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Interview Mode</label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-200 rounded-md outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              >
                <option value="All">All Modes</option>
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
              </select>
            </div>

            {/* Result Dropdown */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Outcome Status</label>
              <select
                value={result}
                onChange={(e) => setResult(e.target.value)}
                className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-200 rounded-md outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              >
                <option value="All">All Outcomes</option>
                <option value="Selected">Selected</option>
                <option value="Rejected">Rejected</option>
                <option value="Waiting">Waiting</option>
              </select>
            </div>

            {/* Graduation Year Dropdown */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Graduation Year</label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-200 rounded-md outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              >
                <option value="All">All Years</option>
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
              </select>
            </div>
          </div>
          
          <button
            onClick={() => {
              setSearchTerm('');
              setDifficulty('All');
              setMode('All');
              setResult('All');
              setYear('All');
            }}
            className="w-full py-2 bg-gray-50 text-gray-700 hover:bg-gray-100 text-xs font-semibold border border-gray-200 rounded-md transition cursor-pointer"
          >
            Reset All Filters
          </button>
        </aside>

        {/* Search Results Area */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Primary Top Search Input */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-grow w-full">
              <input
                type="text"
                placeholder="Search by Company, Job Role, or College Name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm transition"
              />
            </div>

            {/* Sorting Toggles */}
            <div className="flex space-x-2 shrink-0">
              <button
                onClick={() => setSortBy('newest')}
                className={`px-4 py-2.5 text-xs font-bold rounded-md border transition cursor-pointer ${
                  sortBy === 'newest'
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                Newest
              </button>
              <button
                onClick={() => setSortBy('oldest')}
                className={`px-4 py-2.5 text-xs font-bold rounded-md border transition cursor-pointer ${
                  sortBy === 'oldest'
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                Oldest
              </button>
            </div>
          </div>

          {/* Results Grid with Loader Skeletons */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="h-6 w-1/3 bg-gray-200 rounded"></div>
                    <div className="h-5 w-1/4 bg-gray-200 rounded-full"></div>
                  </div>
                  <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                  <div className="space-y-2 pt-2">
                    <div className="h-3 w-full bg-gray-200 rounded"></div>
                    <div className="h-3 w-5/6 bg-gray-200 rounded"></div>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <div className="h-4 w-1/4 bg-gray-200 rounded"></div>
                    <div className="h-4 w-1/4 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredData.length === 0 ? (
            <div className="text-center py-20 bg-white border border-gray-200 rounded-xl">
              <p className="text-gray-500 font-semibold">No interview experiences match your query.</p>
              <p className="text-sm text-gray-400 mt-2">Try adjusting your filters or search keywords.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredData.map((exp) => (
                <div
                  key={exp._id}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-between p-6"
                >
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{exp.companyName}</h3>
                        <p className="text-sm text-gray-500 mt-0.5">{exp.jobRole}</p>
                      </div>
                      <span className={`px-2.5 py-1 border rounded-full text-xs font-semibold ${getResultColor(exp.result)}`}>
                        {exp.result}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                      {exp.overallReview}
                    </p>
                    
                    <div className="text-xs text-gray-500 mb-6 space-y-1">
                      <p><span className="font-semibold text-gray-700">College:</span> {exp.user?.college || 'Not Specified'}</p>
                      <p><span className="font-semibold text-gray-700">Graduation:</span> {exp.user?.graduationYear || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center border-t border-gray-100 pt-4 mt-auto">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2.5 py-0.5 border rounded-full text-xs font-semibold ${getDifficultyColor(exp.difficulty)}`}>
                        {exp.difficulty}
                      </span>
                      <span className="text-xs text-gray-400">{exp.interviewMode}</span>
                    </div>
                    
                    <Link
                      to={`/experience/${exp._id}`}
                      className="text-sm font-semibold text-primary hover:underline"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default SearchHub;
