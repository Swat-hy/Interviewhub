import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-12345';

const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  const { fullName, email, password, college, graduationYear, aboutMe } = req.body;

  try {
    // 1. Validation
    if (!fullName || !email || !password || !college || !graduationYear) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    // 2. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // 3. Create User record (password automatically hashed by pre-save hook)
    const user = await User.create({
      fullName,
      email,
      password,
      college,
      graduationYear,
      aboutMe
    });

    // 4. Generate JWT
    const token = generateToken(user._id);

    // 5. Send Response
    res.status(201).json({
      message: 'User registered successfully!',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        college: user.college,
        graduationYear: user.graduationYear,
        aboutMe: user.aboutMe,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Server error during user registration' });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // 2. Find User by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // 3. Compare passwords using mongoose model comparePassword helper
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // 4. Generate JWT
    const token = generateToken(user._id);

    // 5. Send Response
    res.status(200).json({
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        college: user.college,
        graduationYear: user.graduationYear,
        aboutMe: user.aboutMe,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error while fetching user profile' });
  }
};
