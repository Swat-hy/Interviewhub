import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api.js';

const Home = () => {
  const [latestExperiences, setLatestExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch approved live interview experiences on mount
  useEffect(() => {
    const fetchLatestExperiences = async () => {
      try {
        setLoading(true);
        const response = await api.get('/experiences');
        // Slice the top 3 most recent entries for the homepage feed
        setLatestExperiences(response.data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching latest experiences:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestExperiences();
  }, []);

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

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-white border-b border-gray-100 py-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-none mb-6">
            Learn From Real <span className="text-primary">Interview Experiences</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto mb-10">
            Read genuine interview experiences shared by students and professionals.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              to="/search"
              className="w-full sm:w-auto px-8 py-3.5 bg-primary text-white font-semibold rounded-lg shadow-sm hover:bg-blue-700 transition cursor-pointer"
            >
              Explore Experiences
            </Link>
            <Link
              to="/add-experience"
              className="w-full sm:w-auto px-8 py-3.5 bg-white text-gray-700 font-semibold border border-gray-300 rounded-lg hover:bg-gray-50 transition cursor-pointer"
            >
              Share Your Experience
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Experiences Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Latest Experiences</h2>
          <Link to="/search" className="text-sm font-semibold text-primary hover:underline">
            View all →
          </Link>
        </div>

        {loading ? (
          /* Pulse loading skeletons */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4 shadow-sm">
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
        ) : latestExperiences.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <p className="text-gray-500 font-semibold">No interview experiences found.</p>
            <Link to="/add-experience" className="text-primary hover:underline mt-2 inline-block font-semibold">
              Be the first to share your experience!
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestExperiences.map((exp) => (
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
                    {/* Outcome Badge (Emerald Green #10B981) */}
                    {exp.result === 'Selected' && (
                      <span className="px-2.5 py-1 bg-emerald-50 text-accent border border-emerald-200 rounded-full text-xs font-semibold">
                        Selected
                      </span>
                    )}
                  </div>

                  <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed">
                    {exp.overallReview}
                  </p>
                </div>

                <div className="flex justify-between items-center border-t border-gray-100 pt-4 mt-auto">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2.5 py-0.5 border rounded-full text-xs font-semibold ${getDifficultyColor(exp.difficulty)}`}>
                      {exp.difficulty}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(exp.createdAt).toLocaleDateString()}
                    </span>
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
      </section>
    </div>
  );
};

export default Home;
