import Experience from '../models/Experience.js';
import User from '../models/User.js';

// @desc    Create a new interview experience (pending by default)
// @route   POST /api/experiences
// @access  Private
export const createExperience = async (req, res) => {
  const {
    companyName,
    jobRole,
    interviewMode,
    difficulty,
    result,
    rounds,
    overallReview,
    overallRating
  } = req.body;

  try {
    if (!companyName || !jobRole || !interviewMode || !difficulty || !result || !overallReview || !overallRating) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const experience = await Experience.create({
      user: req.user.userId,
      companyName,
      jobRole,
      interviewMode,
      difficulty,
      result,
      rounds,
      overallReview,
      overallRating,
      isApproved: false // Must be approved by admin moderation
    });

    res.status(201).json({
      message: 'Experience submitted successfully and is pending approval.',
      experience
    });
  } catch (error) {
    console.error('Error creating experience:', error);
    res.status(500).json({ message: 'Server error while submitting experience.' });
  }
};

// @desc    Get all approved experiences with optional filters and sorting
// @route   GET /api/experiences
// @access  Public
export const getAllExperiences = async (req, res) => {
  const { companyName, jobRole, college, difficulty, interviewMode, result, sortBy } = req.query;
  let matchQuery = { isApproved: true };

  try {
    if (companyName) {
      matchQuery.companyName = { $regex: companyName, $options: 'i' };
    }
    if (jobRole) {
      matchQuery.jobRole = { $regex: jobRole, $options: 'i' };
    }
    if (difficulty) {
      matchQuery.difficulty = difficulty;
    }
    if (interviewMode) {
      matchQuery.interviewMode = interviewMode;
    }
    if (result) {
      matchQuery.result = result;
    }
    if (college) {
      const users = await User.find({ college: { $regex: college, $options: 'i' } }).select('_id');
      const userIds = users.map((u) => u._id);
      matchQuery.user = { $in: userIds };
    }

    let sortOption = { createdAt: -1 }; // newest by default
    if (sortBy === 'oldest') {
      sortOption = { createdAt: 1 };
    }

    const experiences = await Experience.find(matchQuery)
      .populate('user', 'fullName email college graduationYear aboutMe')
      .sort(sortOption);

    res.status(200).json(experiences);
  } catch (error) {
    console.error('Error fetching experiences:', error);
    res.status(500).json({ message: 'Server error while fetching experiences.' });
  }
};

// @desc    Get experience details by ID
// @route   GET /api/experiences/:id
// @access  Public
export const getExperienceById = async (req, res) => {
  const { id } = req.params;

  try {
    const experience = await Experience.findById(id)
      .populate('user', 'fullName email college graduationYear aboutMe')
      .populate('comments.user', 'fullName email college');

    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }

    res.status(200).json(experience);
  } catch (error) {
    console.error('Error fetching experience details:', error);
    res.status(500).json({ message: 'Server error while fetching experience details.' });
  }
};

// @desc    Toggle like state for experience
// @route   POST /api/experiences/:id/like
// @access  Private
export const toggleLike = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    const experience = await Experience.findById(id);
    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }

    const index = experience.likes.indexOf(userId);
    if (index === -1) {
      experience.likes.push(userId);
    } else {
      experience.likes.splice(index, 1);
    }

    await experience.save();

    // Fetch the updated populated document
    const updatedExperience = await Experience.findById(id)
      .populate('user', 'fullName email college graduationYear')
      .populate('comments.user', 'fullName email college');

    res.status(200).json(updatedExperience);
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({ message: 'Server error while toggling like.' });
  }
};

// @desc    Add comment to experience
// @route   POST /api/experiences/:id/comment
// @access  Private
export const addComment = async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  const userId = req.user.userId;

  try {
    if (!text) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const experience = await Experience.findById(id);
    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }

    const comment = {
      user: userId,
      text,
      createdAt: new Date()
    };

    experience.comments.push(comment);
    await experience.save();

    const updatedExperience = await Experience.findById(id)
      .populate('comments.user', 'fullName email');

    res.status(201).json({
      message: 'Comment added successfully',
      comments: updatedExperience.comments
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Server error while adding comment.' });
  }
};

// @desc    Get current user's experiences (approved and pending)
// @route   GET /api/experiences/my
// @access  Private
export const getMyExperiences = async (req, res) => {
  try {
    const experiences = await Experience.find({ user: req.user.userId })
      .populate('user', 'fullName email college graduationYear')
      .sort({ createdAt: -1 });
    res.status(200).json(experiences);
  } catch (error) {
    console.error('Error fetching personal experiences:', error);
    res.status(500).json({ message: 'Server error while fetching personal experiences.' });
  }
};

// @desc    Delete user's own interview experience
// @route   DELETE /api/experiences/:id
// @access  Private
export const deleteExperience = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    const experience = await Experience.findById(id);
    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }

    if (experience.user.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this experience' });
    }

    await Experience.findByIdAndDelete(id);
    res.status(200).json({ message: 'Experience deleted successfully' });
  } catch (error) {
    console.error('Error deleting experience:', error);
    res.status(500).json({ message: 'Server error while deleting experience.' });
  }
};
