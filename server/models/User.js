import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const { Schema } = mongoose;

const userSchema = new Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  college: {
    type: String,
    required: true
  },
  graduationYear: {
    type: Number,
    required: true
  },
  aboutMe: {
    type: String
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student'
  },
  bookmarks: [{
    type: Schema.Types.ObjectId,
    ref: 'Experience'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save hook to automatically hash password before storing
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Helper method to compare candidate password during sign-in
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
