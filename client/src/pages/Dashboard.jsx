import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import './Dashboard.css';

const Dashboard = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Add Question Form States
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');

  // Fetch Questions
  const fetchQuestions = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/questions');
      const data = await response.json();
      
      if (response.ok) {
        setQuestions(data.questions || []);
      } else {
        setError(data.message || 'Failed to fetch questions');
      }
    } catch (err) {
      setError('Network error: Could not connect to server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  // Handle Add Question Form Submission
  const handleAddQuestion = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          category,
          difficulty,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || 'Question added successfully!');
        // Reset Form Fields
        setTitle('');
        setDescription('');
        setCategory('');
        setDifficulty('Easy');
        // Refetch questions list instantly
        fetchQuestions();
      } else {
        toast.error(data.message || 'Failed to add question.');
      }
    } catch (err) {
      toast.error(`Error adding question: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-state">
          Loading questions...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-state dashboard-error">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">Interview Questions</h1>
        <span className="dashboard-count">
          Total Questions: {questions.length}
        </span>
      </div>

      {/* Add Question Form Card */}
      <div className="add-question-container">
        <h3 className="form-title">Add New Interview Question</h3>
        <form onSubmit={handleAddQuestion} className="add-question-form">
          <div className="form-row">
            <div className="form-col" style={{ flex: '2' }}>
              <label>Question Title</label>
              <input
                type="text"
                placeholder="e.g., Explain Virtual DOM in React"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="form-col">
              <label>Category</label>
              <input
                type="text"
                placeholder="e.g., React, Node, Database"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              />
            </div>
            <div className="form-col">
              <label>Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-col">
              <label>Description / Answer Outline</label>
              <textarea
                placeholder="Provide a description or answer outline for this question..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="3"
                required
              />
            </div>
          </div>
          <button type="submit" className="btn-add">
            Add Question
          </button>
        </form>
      </div>

      {/* Questions Table List */}
      {questions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px', border: '1px dashed #e0e0e0', borderRadius: '6px', color: '#656d76', backgroundColor: '#ffffff' }}>
          No questions available.
        </div>
      ) : (
        <table className="questions-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Difficulty</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((question) => (
              <tr key={question._id}>
                <td style={{ fontWeight: '500', color: '#1f2328' }}>
                  {question.title}
                </td>
                <td>
                  <span className="category-tag">
                    {question.category}
                  </span>
                </td>
                <td>
                  <span className={`difficulty-badge ${question.difficulty.toLowerCase()}`}>
                    {question.difficulty}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Dashboard;
