import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      required: [true, 'Please select difficulty'],
    },
  },
  {
    timestamps: true,
  }
);

const Question = mongoose.model('Question', questionSchema);

export default Question;
