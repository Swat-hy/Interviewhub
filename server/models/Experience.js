import mongoose from 'mongoose';

const { Schema } = mongoose;

const experienceSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  jobRole: {
    type: String,
    required: true
  },
  interviewMode: {
    type: String,
    enum: ['Online', 'Offline'],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true
  },
  result: {
    type: String,
    enum: ['Selected', 'Rejected', 'Waiting'],
    required: true
  },
  rounds: [{
    roundName: String,
    questionsAsked: String,
    codingProblems: String,
    hrQuestions: String,
    duration: String,
    tips: String
  }],
  overallReview: {
    type: String,
    required: true
  },
  overallRating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    text: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isApproved: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Experience = mongoose.model('Experience', experienceSchema);
export default Experience;
