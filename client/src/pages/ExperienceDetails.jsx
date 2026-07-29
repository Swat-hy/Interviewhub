import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../utils/api.js';

const ExperienceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Dynamic States
  const [experience, setExperience] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  // Fetch specific experience detail on load
  useEffect(() => {
    const fetchExperienceDetail = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/experiences/${id}`);
        setExperience(response.data);
      } catch (err) {
        console.error('Error loading experience details:', err);
        setErrorMsg(err.response?.data?.message || 'Error loading experience details.');
      } finally {
        setLoading(false);
      }
    };

    fetchExperienceDetail();
  }, [id]);

  // Handle Liking / Unliking Toggle
  const handleLike = async () => {
    if (!user) {
      alert('Please log in to like this post.');
      return;
    }

    try {
      const response = await api.post(`/experiences/${id}/like`);
      setExperience(response.data);
    } catch (err) {
      console.error('Error toggling like:', err);
      alert(err.response?.data?.message || 'Error liking experience.');
    }
  };

  // Handle Comment Submission
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    if (!user) {
      alert('Please log in to comment.');
      return;
    }

    try {
      setSubmittingComment(true);
      const response = await api.post(`/experiences/${id}/comment`, { text: newComment.trim() });
      setExperience(response.data);
      setNewComment('');
    } catch (err) {
      console.error('Error submitting comment:', err);
      alert(err.response?.data?.message || 'Error posting comment.');
    } finally {
      setSubmittingComment(false);
    }
  };

  const getDifficultyColor = (diff) => {
    switch (diff) {
      case 'Easy':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'Medium':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'Hard':
        return 'text-rose-600 bg-rose-50 border-rose-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (errorMsg || !experience) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
          <p className="text-red-500 font-semibold text-lg">{errorMsg || 'Experience not found.'}</p>
          <button
            onClick={() => navigate('/')}
            className="mt-6 px-6 py-2.5 bg-primary text-white font-semibold rounded-md hover:bg-blue-700 transition"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  // Determine if the current authenticated user has liked the experience
  const hasLiked = user && experience.likes?.includes(user._id || user.userId);
  const likesCount = experience.likes?.length || 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-sm font-semibold text-gray-500 hover:text-primary mb-6 transition cursor-pointer"
      >
        <span>← Back</span>
      </button>

      {/* Main Experience Detail Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-8">
        
        {/* 1. Header Section */}
        <div className="p-8 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                {experience.companyName}
              </h1>
              <div className="flex flex-wrap items-center gap-3 mt-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-primary border border-blue-100">
                  {experience.jobRole}
                </span>
                <span className="text-sm text-gray-400">
                  Published on {new Date(experience.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="text-sm text-gray-500 sm:text-right space-y-1">
              <p>
                <span className="font-semibold text-gray-700">Submitted by:</span> {experience.user?.fullName || 'Anonymous'}
              </p>
              <p>
                <span className="font-semibold text-gray-700">College:</span> {experience.user?.college || 'Not Specified'}
              </p>
              <p>
                <span className="font-semibold text-gray-700">Mode:</span> {experience.interviewMode}
              </p>
            </div>
          </div>
          <p className="text-gray-600 text-sm mt-6 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100">
            {experience.overallReview}
          </p>
        </div>

        {/* 2. Status Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 border-b border-gray-100">
          {/* Difficulty Info Box */}
          <div className="p-6 flex flex-col items-center justify-center border-b sm:border-b-0 sm:border-r border-gray-100">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Difficulty Level</span>
            <span className={`text-xl font-bold mt-2 px-3 py-1 border rounded-full ${getDifficultyColor(experience.difficulty)}`}>
              {experience.difficulty}
            </span>
          </div>

          {/* Result Status Box (Emerald Green accent filtered) */}
          <div className="p-6 flex flex-col items-center justify-center bg-emerald-50/20">
            <span className="text-xs font-semibold text-emerald-600/80 uppercase tracking-wider">Interview Outcome</span>
            <span className={`text-xl font-bold mt-2 px-4 py-1 border rounded-full ${getResultColor(experience.result)}`}>
              {experience.result}
            </span>
          </div>
        </div>

        {/* 3. Dynamic Rounds Timeline */}
        <div className="p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-8">Interview Process Timeline</h2>
          
          {experience.rounds && experience.rounds.length > 0 ? (
            <div className="relative border-l border-gray-200 ml-3 space-y-10">
              {experience.rounds.map((round, idx) => (
                <div key={idx} className="relative pl-8">
                  {/* Bullet node dot */}
                  <span className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-primary border border-white"></span>
                  
                  {/* Header card info */}
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                    <h3 className="text-lg font-bold text-gray-800">{round.roundName || `Round ${idx + 1}`}</h3>
                    <span className="inline-flex text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded shrink-0">
                      {round.duration || 'N/A'}
                    </span>
                  </div>

                  {/* Details layout grids */}
                  <div className="bg-gray-50 rounded-lg p-5 border border-gray-100 space-y-4">
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Questions Discussed</h4>
                      <p className="text-sm text-gray-700 mt-1">{round.questionsAsked || 'No theoretical questions specified.'}</p>
                    </div>
                    
                    {round.codingProblems && round.codingProblems !== 'None' && (
                      <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Coding Problems</h4>
                        <p className="text-sm text-gray-700 mt-1 font-mono">{round.codingProblems}</p>
                      </div>
                    )}

                    {round.hrQuestions && round.hrQuestions !== 'None' && (
                      <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Behavioral / HR Questions</h4>
                        <p className="text-sm text-gray-700 mt-1">{round.hrQuestions}</p>
                      </div>
                    )}

                    {round.tips && (
                      <div className="border-t border-gray-200/60 pt-3">
                        <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Preparation Advice</h4>
                        <p className="text-sm text-gray-700 mt-1 italic">"{round.tips}"</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No timeline rounds logged for this experience.</p>
          )}
        </div>

      </div>

      {/* 4. Engagement Bar Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
          <div className="flex items-center space-x-4">
            {/* Like Button */}
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 text-sm font-semibold px-4 py-2 rounded-md transition cursor-pointer ${
                hasLiked ? 'bg-rose-50 text-rose-600' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>{hasLiked ? '❤️ Liked' : '🖤 Like'}</span>
              <span className="font-bold">{likesCount}</span>
            </button>

            {/* Share Button */}
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert('Link copied to clipboard!');
              }}
              className="flex items-center space-x-2 text-sm font-semibold bg-gray-50 text-gray-600 px-4 py-2 rounded-md hover:bg-gray-100 transition cursor-pointer"
            >
              <span>📤 Share</span>
            </button>
          </div>
          <span className="text-sm text-gray-400">{(experience.comments?.length || 0)} Comments</span>
        </div>

        {/* Comment Entry Area */}
        <form onSubmit={handleCommentSubmit} className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Leave a Comment</label>
          <textarea
            placeholder="Add to the discussion or ask questions about this experience..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows="3"
            className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm transition mb-3"
            required
            disabled={submittingComment}
          />
          <button
            type="submit"
            disabled={submittingComment}
            className="px-5 py-2 bg-primary text-white text-sm font-semibold rounded-md hover:bg-blue-700 transition cursor-pointer disabled:opacity-50"
          >
            {submittingComment ? 'Posting...' : 'Post Comment'}
          </button>
        </form>

        {/* Comment Listing */}
        <div className="space-y-4">
          {experience.comments && experience.comments.length > 0 ? (
            experience.comments.map((comment, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <div className="flex justify-between items-center mb-1">
                  <div>
                    <span className="text-sm font-bold text-gray-900">{comment.user?.fullName || 'Anonymous'}</span>
                    {comment.user?.college && (
                      <span className="text-xs text-gray-400 ml-2">({comment.user.college})</span>
                    )}
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mt-1">{comment.text}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-sm text-center py-4">No comments posted yet. Start the conversation!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExperienceDetails;
