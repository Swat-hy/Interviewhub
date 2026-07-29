import React from 'react';

const Admin = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="border-b border-gray-200 pb-5 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 leading-tight">Admin Dashboard</h1>
        <p className="text-sm text-gray-500 mt-2">Manage users, questions, and flagged interview experiences.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-gray-500 text-sm font-semibold uppercase">Total Users</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">124</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-gray-500 text-sm font-semibold uppercase">Active Questions</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">42</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-gray-500 text-sm font-semibold uppercase">Pending Approvals</h3>
          <p className="text-3xl font-bold text-red-600 mt-2">5</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Admin Actions</h2>
        <div className="space-y-4">
          <p className="text-gray-600">Placeholder for user role management and submission moderation tools.</p>
        </div>
      </div>
    </div>
  );
};

export default Admin;
