import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api.js';

const AddExperience = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    companyName: '',
    jobRole: '',
    interviewMode: 'Online',
    difficulty: 'Medium',
    result: 'Selected',
    overallReview: '',
    overallRating: '5',
    // Round Details
    roundName: 'Technical Interview',
    questionsAsked: '',
    codingProblems: '',
    hrQuestions: '',
    duration: '45 mins',
    tips: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => setStep((prev) => Math.min(prev + 1, 3));
  const handlePrev = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Compile Mongoose schema payload matching the Experience.js layout
    const payload = {
      companyName: formData.companyName,
      jobRole: formData.jobRole,
      interviewMode: formData.interviewMode,
      difficulty: formData.difficulty,
      result: formData.result,
      overallReview: formData.overallReview,
      overallRating: parseInt(formData.overallRating),
      rounds: [
        {
          roundName: formData.roundName,
          questionsAsked: formData.questionsAsked || 'None',
          codingProblems: formData.codingProblems || 'None',
          hrQuestions: formData.hrQuestions || 'None',
          duration: formData.duration,
          tips: formData.tips
        }
      ]
    };

    try {
      await api.post('/experiences', payload);
      alert('Interview experience submitted successfully! It is now pending moderation approval.');
      navigate('/'); // Redirect back to Home route
    } catch (error) {
      console.error('Submission error:', error);
      const errorMsg = error.response?.data?.message || 'Error submitting experience.';
      alert(errorMsg);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Share Your Interview Experience</h1>
        
        {/* Progress Tracker */}
        <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
          <span className={`text-sm font-semibold ${step === 1 ? 'text-primary' : 'text-gray-400'}`}>1. Job Details</span>
          <span className={`text-sm font-semibold ${step === 2 ? 'text-primary' : 'text-gray-400'}`}>2. Process & Rating</span>
          <span className={`text-sm font-semibold ${step === 3 ? 'text-primary' : 'text-gray-400'}`}>3. Round Details & Tips</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name</label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="e.g., Google, Amazon"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm text-gray-900 bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Job Role / Title</label>
                  <input
                    type="text"
                    name="jobRole"
                    value={formData.jobRole}
                    onChange={handleChange}
                    placeholder="e.g., Frontend Engineer"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm text-gray-900 bg-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Interview Mode</label>
                  <select
                    name="interviewMode"
                    value={formData.interviewMode}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm text-gray-900 bg-white"
                  >
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Difficulty</label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm text-gray-900 bg-white"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Outcome Result</label>
                  <select
                    name="result"
                    value={formData.result}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm text-gray-900 bg-white"
                  >
                    <option value="Selected">Selected</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Waiting">Waiting</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Overall Process Rating (1-5)</label>
                <select
                  name="overallRating"
                  value={formData.overallRating}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm text-gray-900 bg-white"
                >
                  <option value="5">5 - Excellent</option>
                  <option value="4">4 - Good</option>
                  <option value="3">3 - Average</option>
                  <option value="2">2 - Below Average</option>
                  <option value="1">1 - Poor</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Describe the Overall Process</label>
                <textarea
                  name="overallReview"
                  value={formData.overallReview}
                  onChange={handleChange}
                  placeholder="Share a general summary of the experience, recruitment stages, or panel behavior..."
                  rows="6"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm text-gray-900 bg-white"
                  required
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Round Name</label>
                  <input
                    type="text"
                    name="roundName"
                    value={formData.roundName}
                    onChange={handleChange}
                    placeholder="e.g., Coding Round 1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm text-gray-900 bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Duration</label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder="e.g., 45 mins"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm text-gray-900 bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Questions Asked</label>
                <textarea
                  name="questionsAsked"
                  value={formData.questionsAsked}
                  onChange={handleChange}
                  placeholder="Describe conceptual or theoretical questions asked..."
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm text-gray-900 bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Coding Problems</label>
                <textarea
                  name="codingProblems"
                  value={formData.codingProblems}
                  onChange={handleChange}
                  placeholder="e.g., LeetCode 121: Best Time to Buy and Sell Stock"
                  rows="2"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm text-gray-900 font-mono bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Googliness / HR Questions</label>
                <textarea
                  name="hrQuestions"
                  value={formData.hrQuestions}
                  onChange={handleChange}
                  placeholder="Behavioral or scenario-based questions asked..."
                  rows="2"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm text-gray-900 bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Advice & Preparation Tips</label>
                <textarea
                  name="tips"
                  value={formData.tips}
                  onChange={handleChange}
                  placeholder="What resources did you use? What should future candidates focus on?"
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm text-gray-900 bg-white"
                  required
                />
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            {step > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                className="px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-md hover:bg-gray-200 transition text-sm cursor-pointer"
              >
                Back
              </button>
            ) : (
              <div />
            )}
            
            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-4 py-2 bg-primary text-white font-semibold rounded-md hover:bg-blue-700 transition text-sm cursor-pointer"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-2 bg-accent text-white font-semibold rounded-md hover:bg-emerald-600 transition text-sm cursor-pointer"
              >
                Submit Experience
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExperience;
