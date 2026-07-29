import Question from '../models/Question.js';

/**
 * @desc    Add a new interview question
 * @route   POST /api/questions
 * @access  Public
 */
export const addQuestion = async (req, res) => {
  try {
    const { title, description, category, difficulty } = req.body;

    // Basic validation
    if (!title || !description || !category || !difficulty) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, category, and difficulty',
      });
    }

    const question = new Question({
      title,
      description,
      category,
      difficulty,
    });

    await question.save();

    return res.status(201).json({
      success: true,
      message: 'Question added successfully',
      question,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Get all interview questions
 * @route   GET /api/questions
 * @access  Public
 */
export const getQuestions = async (req, res) => {
  try {
    const questions = await Question.find({});

    return res.status(200).json({
      success: true,
      count: questions.length,
      questions,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
