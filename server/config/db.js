import mongoose from 'mongoose';

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI;

  // Validate that the MONGO_URI environment variable exists
  if (!mongoURI) {
    throw new Error('Database connection failed: MONGO_URI environment variable is missing.');
  }

  try {
    const conn = await mongoose.connect(mongoURI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
