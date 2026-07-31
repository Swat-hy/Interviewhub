import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { Link } from 'react-router-dom';
import api from '../utils/api.js';
import { toast } from 'react-toastify';

const UserDashboard = () => {
  const { user, loading } = useAuth();

  // Local Profile State for editing
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    college: '',
    gradYear: '',
    aboutMe: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('posts'); // 'posts' | 'bookmarks'
  
  // Student Personal Experiences states
  const [myPosts, setMyPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  // Admin states for pending experiences moderation
  const [pendingPosts, setPendingPosts] = useState([]);
  const [loadingPending, setLoadingPending] = useState(true);

  // Determine if active user has administrator role privileges
  const isAdmin = user?.role === 'admin' || user?.email?.startsWith('admin@');

  // Sync profile editing state when the authenticated user details are resolved
  useEffect(() => {
    if (user) {
      setProfile({
        name: user.fullName || '',
        email: user.email || '',
        college: user.college || '',
        gradYear: user.graduationYear || '',
        aboutMe: user.aboutMe || ''
      });
    }
  }, [user]);

  // Fetch logged-in student's created interview experiences from the database
  useEffect(() => {
    const fetchMyExperiences = async () => {
      try {
        setLoadingPosts(true);
        const response = await api.get('/experiences/my');
        setMyPosts(response.data);
      } catch (error) {
        console.error('Error fetching personal experiences:', error);
      } finally {
        setLoadingPosts(false);
      }
    };

    if (user && !isAdmin) {
      fetchMyExperiences();
    }
  }, [user, isAdmin]);

  // Fetch pending moderation experiences for admin role
  useEffect(() => {
    const fetchPendingExperiences = async () => {
      try {
        setLoadingPending(true);
        const response = await api.get('/admin/pending');
        setPendingPosts(response.data);
      } catch (error) {
        console.error('Error fetching pending experiences:', error);
      } finally {
        setLoadingPending(false);
      }
    };

    if (user && isAdmin) {
      fetchPendingExperiences();
    }
  }, [user, isAdmin]);

  // Mock User Bookmarks
  const myBookmarks = [];

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    setIsEditing(false);
    toast.success('Profile details cached in current local view!');
  };

  // Student deletion of own experience
  const handleDeletePost = async (id) => {
    if (window.confirm('Are you sure you want to delete this interview experience?')) {
      try {
        await api.delete(`/experiences/${id}`);
        setMyPosts(myPosts.filter((post) => post._id !== id));
        toast.success('Experience deleted successfully!');
      } catch (error) {
        console.error('Error deleting experience:', error);
        toast.error(error.response?.data?.message || 'Error deleting experience.');
      }
    }
  };

  // Admin approval flow
  const handleApproveExperience = async (id) => {
    try {
      await api.put(`/admin/approve/${id}`);
      setPendingPosts(pendingPosts.filter((post) => post._id !== id));
      toast.success('Interview experience approved and published successfully!');
    } catch (error) {
      console.error('Approval error:', error);
      toast.error(error.response?.data?.message || 'Error approving experience.');
    }
  };

  // Admin rejection/deletion flow
  const handleRejectExperience = async (id) => {
    if (window.confirm('Are you sure you want to reject and delete this interview experience?')) {
      try {
        await api.delete(`/admin/reject/${id}`);
        setPendingPosts(pendingPosts.filter((post) => post._id !== id));
        toast.success('Experience rejected and removed.');
      } catch (error) {
        console.error('Rejection error:', error);
        toast.error(error.response?.data?.message || 'Error rejecting experience.');
      }
    }
  };

  // Render clean loaders or fallback checks if loading or null
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-20 bg-gray-50 min-h-screen">
        <p className="text-gray-500 font-semibold">User session not found.</p>
        <Link to="/login" className="text-primary hover:underline mt-4 inline-block font-semibold">
          Please log in
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 min-h-screen">
      {/* Dashboard Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Pane: User Profile Sidebar */}
        <aside className="lg:col-span-1 bg-white border border-gray-200 rounded-xl p-6 shadow-sm self-start">
          <div className="text-center pb-6 border-b border-gray-100">
            <div className="w-20 h-20 bg-primary/10 text-primary font-bold text-2xl flex items-center justify-center rounded-full mx-auto mb-4 border border-blue-100 uppercase">
              {profile.name ? profile.name.charAt(0) : 'U'}
            </div>
            <h2 className="text-lg font-bold text-gray-900">{profile.name || 'Anonymous User'}</h2>
            <p className="text-xs text-gray-400 mt-1">{profile.email || 'no-email@example.com'}</p>
            {isAdmin && (
              <span className="inline-block mt-2 px-3 py-0.5 bg-red-50 text-red-600 border border-red-100 rounded-full text-[10px] font-bold uppercase tracking-wider">
                Administrator
              </span>
            )}
          </div>

          <div className="py-6 space-y-4">
            {isEditing ? (
              <form onSubmit={handleProfileSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleProfileChange}
                    className="w-full px-3 py-1.5 text-sm text-gray-900 bg-white border border-gray-200 rounded outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">College</label>
                  <input
                    type="text"
                    name="college"
                    value={profile.college}
                    onChange={handleProfileChange}
                    className="w-full px-3 py-1.5 text-sm text-gray-900 bg-white border border-gray-200 rounded outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Graduation Year</label>
                  <input
                    type="number"
                    name="gradYear"
                    value={profile.gradYear}
                    onChange={handleProfileChange}
                    className="w-full px-3 py-1.5 text-sm text-gray-900 bg-white border border-gray-200 rounded outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">About Me</label>
                  <textarea
                    name="aboutMe"
                    value={profile.aboutMe}
                    onChange={handleProfileChange}
                    rows="3"
                    className="w-full px-3 py-1.5 text-sm text-gray-900 bg-white border border-gray-200 rounded outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-grow py-2 bg-primary text-white text-xs font-semibold rounded hover:bg-blue-700 transition cursor-pointer"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-2 bg-gray-100 text-gray-700 text-xs font-semibold rounded hover:bg-gray-200 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4 text-sm">
                <div>
                  <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">College</span>
                  <p className="text-gray-800 mt-0.5">{profile.college || 'Not Specified'}</p>
                </div>
                <div>
                  <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Graduation Year</span>
                  <p className="text-gray-800 mt-0.5">{profile.gradYear || 'Not Specified'}</p>
                </div>
                <div>
                  <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">About Me</span>
                  <p className="text-gray-600 mt-1 leading-relaxed text-xs">{profile.aboutMe || 'No description provided.'}</p>
                </div>
                
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full py-2 border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-semibold rounded transition cursor-pointer"
                >
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* Right Workspace Area */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Conditional Admin Workspace vs regular student dashboard */}
          {isAdmin ? (
            <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Admin Operations Control Center</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Moderator Panel: Review, approve, or reject candidate interview experience submissions.
                </p>
              </div>

              {loadingPending ? (
                <div className="text-center py-12 text-gray-400 text-sm animate-pulse">
                  Fetching pending submissions...
                </div>
              ) : pendingPosts.length === 0 ? (
                <div className="text-center py-12 text-gray-500 font-semibold border border-dashed border-gray-200 rounded-lg bg-gray-50/50">
                  🎉 No pending submissions waiting for review!
                </div>
              ) : (
                <div className="space-y-6">
                  {pendingPosts.map((post) => (
                    <div key={post._id} className="border border-gray-200 rounded-lg p-6 bg-gray-50/40 hover:bg-gray-50 transition flex flex-col justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-3">
                            <h4 className="font-bold text-gray-900 text-lg">{post.companyName}</h4>
                            <span className="inline-block text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                              {post.jobRole}
                            </span>
                          </div>
                          <span className="text-xs text-gray-400">
                            Submitted on {new Date(post.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <p className="text-xs text-gray-500">
                          <span className="font-semibold text-gray-700">Submitted by:</span> {post.user?.fullName || 'Unknown'} ({post.user?.college || 'No college'})
                        </p>
                        
                        <p className="text-gray-700 text-sm mt-4 leading-relaxed bg-white border border-gray-100 rounded p-4">
                          {post.overallReview}
                        </p>
                        
                        <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-500">
                          <p>Difficulty: <span className="font-bold text-gray-700">{post.difficulty}</span></p>
                          <p>Mode: <span className="font-bold text-gray-700">{post.interviewMode}</span></p>
                          <p>Outcome: <span className="font-bold text-gray-700">{post.result}</span></p>
                        </div>
                      </div>

                      <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
                        <button
                          onClick={() => handleRejectExperience(post._id)}
                          className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold rounded-md transition cursor-pointer"
                        >
                          Reject & Delete
                        </button>
                        <button
                          onClick={() => handleApproveExperience(post._id)}
                          className="px-4 py-2 bg-emerald-50 text-accent hover:bg-emerald-100 text-xs font-bold rounded-md transition cursor-pointer"
                        >
                          Approve & Publish
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <>
              {/* 2. Student Analytics Metric Row */}
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Total Posts</span>
                  <span className="text-2xl font-bold text-gray-900 mt-2 block">{myPosts.length}</span>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Total Likes</span>
                  <span className="text-2xl font-bold text-gray-900 mt-2 block">
                    {myPosts.reduce((acc, curr) => acc + (curr.likes?.length || 0), 0)}
                  </span>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Total Comments</span>
                  <span className="text-2xl font-bold text-gray-900 mt-2 block">
                    {myPosts.reduce((acc, curr) => acc + (curr.comments?.length || 0), 0)}
                  </span>
                </div>
              </div>

              {/* 3. Student Content Toggle Workspace */}
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className="flex border-b border-gray-100 bg-gray-50/50">
                  <button
                    onClick={() => setActiveTab('posts')}
                    className={`flex-grow sm:flex-initial px-6 py-4 text-sm font-semibold border-b-2 transition cursor-pointer ${
                      activeTab === 'posts'
                        ? 'border-primary text-primary bg-white'
                        : 'border-transparent text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    My Posted Experiences
                  </button>
                  <button
                    onClick={() => setActiveTab('bookmarks')}
                    className={`flex-grow sm:flex-initial px-6 py-4 text-sm font-semibold border-b-2 transition cursor-pointer ${
                      activeTab === 'bookmarks'
                        ? 'border-primary text-primary bg-white'
                        : 'border-transparent text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    My Bookmarks
                  </button>
                </div>

                <div className="p-6">
                  {activeTab === 'posts' ? (
                    loadingPosts ? (
                      <div className="text-center py-12 text-gray-400 text-sm animate-pulse">
                        Loading your experiences...
                      </div>
                    ) : myPosts.length === 0 ? (
                      <div className="text-center py-12 text-gray-400 text-sm">
                        No posted experiences found. Share your first experience to get started!
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {myPosts.map((post) => (
                          <div key={post._id} className="border border-gray-150 rounded-lg p-5 flex flex-col sm:flex-row justify-between items-start gap-4">
                            <div>
                              <div className="flex flex-wrap items-center gap-3">
                                <h4 className="font-bold text-gray-900 text-lg">{post.companyName}</h4>
                                <span className="inline-block text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                  {post.jobRole}
                                </span>
                                {post.isApproved ? (
                                  <span className="px-2.5 py-0.5 bg-emerald-50 text-accent border border-emerald-100 rounded text-[10px] font-bold uppercase tracking-wider">
                                    Approved
                                  </span>
                                ) : (
                                  <span className="px-2.5 py-0.5 bg-amber-50 text-amber-600 border border-amber-100 rounded text-[10px] font-bold uppercase tracking-wider">
                                    Pending Approval
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-400 mt-1">
                                Shared on {new Date(post.createdAt).toLocaleDateString()} • Difficulty: <span className="font-bold text-gray-700">{post.difficulty}</span>
                              </p>
                              <p className="text-gray-600 text-sm mt-3 line-clamp-2">{post.overallReview}</p>
                            </div>
                            
                            <div className="flex gap-2 self-end sm:self-auto shrink-0">
                              <Link
                                to={`/experience/${post._id}`}
                                className="px-3 py-1.5 border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-bold rounded transition"
                              >
                                View
                              </Link>
                              <button
                                onClick={() => handleDeletePost(post._id)}
                                className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold rounded transition cursor-pointer"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  ) : (
                    myBookmarks.length === 0 ? (
                      <div className="text-center py-12 text-gray-400 text-sm">
                        No bookmarks saved. Save experiences from the Search Hub to view them here.
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {myBookmarks.map((bookmark) => (
                          <div key={bookmark.id} className="border border-gray-150 rounded-lg p-5 flex justify-between items-center gap-4">
                            <div>
                              <div className="flex items-center gap-3">
                                <h4 className="font-bold text-gray-900 text-lg">{bookmark.companyName}</h4>
                                <span className="inline-block text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                  {bookmark.jobRole}
                                </span>
                              </div>
                              <p className="text-xs text-gray-400 mt-1">Difficulty: <span className="font-bold text-gray-700">{bookmark.difficulty}</span></p>
                              <p className="text-gray-600 text-sm mt-3 line-clamp-2">{bookmark.overallReview}</p>
                            </div>
                            <Link
                              to={`/experience/${bookmark.id}`}
                              className="px-3 py-1.5 border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-bold rounded transition shrink-0"
                            >
                              View
                            </Link>
                          </div>
                        ))}
                      </div>
                    )
                  )}
                </div>
              </div>
            </>
          )}

        </div>

      </div>
    </div>
  );
};

export default UserDashboard;
