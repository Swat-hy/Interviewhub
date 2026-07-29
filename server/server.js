import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import questionRoutes from './routes/questionRoutes.js';
import experienceRoutes from './routes/experienceRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();

// CORS Middleware
app.use(cors());

// Connect to Database
connectDB();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/experiences', experienceRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('success');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
