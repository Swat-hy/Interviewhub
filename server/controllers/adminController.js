import Experience from '../models/Experience.js';

// @desc    Get all pending experiences (isApproved: false)
// @route   GET /api/admin/pending
// @access  Private/Admin
export const getPendingExperiences = async (req, res) => {
  try {
    const experiences = await Experience.find({ isApproved: false })
      .populate('user', 'fullName email college graduationYear');
    res.status(200).json(experiences);
  } catch (error) {
    console.error('Error fetching pending experiences:', error);
    res.status(500).json({ message: 'Server error while fetching pending experiences.' });
  }
};

// @desc    Approve experience (set isApproved to true)
// @route   PUT /api/admin/approve/:id
// @access  Private/Admin
export const approveExperience = async (req, res) => {
  const { id } = req.params;

  try {
    const experience = await Experience.findById(id);
    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }

    experience.isApproved = true;
    await experience.save();

    res.status(200).json({
      message: 'Experience approved successfully',
      experience
    });
  } catch (error) {
    console.error('Error approving experience:', error);
    res.status(500).json({ message: 'Server error during experience approval.' });
  }
};

// @desc    Reject experience (delete from database)
// @route   DELETE /api/admin/reject/:id
// @access  Private/Admin
export const rejectExperience = async (req, res) => {
  const { id } = req.params;

  try {
    const experience = await Experience.findByIdAndDelete(id);
    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }

    res.status(200).json({
      message: 'Experience rejected and deleted successfully'
    });
  } catch (error) {
    console.error('Error rejecting experience:', error);
    res.status(500).json({ message: 'Server error during experience rejection.' });
  }
};
