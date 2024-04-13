import mongoose from 'mongoose';

const issueSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: 'pending',
    },
    code: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    feedbackPhoto: String,
    feedbackMessage: String,
  },
  {
    timestamps: true,
  }
);

const Issue = mongoose.model('Issue', issueSchema);

export default Issue;
