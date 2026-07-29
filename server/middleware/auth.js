import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-12345';

// Authenticate token and populate req.user payload
export const protect = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET);

      req.user = decoded;
      next();
    } catch (error) {
      console.error('Token validation failed:', error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

// Validate that the request sender is an administrator
export const adminOnly = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (user && (user.role === 'admin' || user.email.startsWith('admin@'))) {
      next();
    } else {
      return res.status(403).json({ message: 'Access denied. Administrators only.' });
    }
  } catch (error) {
    console.error('Admin verification error:', error);
    res.status(500).json({ message: 'Server error during role validation' });
  }
};
