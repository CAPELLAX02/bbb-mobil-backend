import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    isEmailVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
    isBanned: {
      type: Boolean,
      required: true,
      default: false,
    },
    emailVerificationCode: String,
    emailVerificationCodeExpires: Date,
    resetPasswordCode: String,
    resetPasswordCodeExpires: Date,
    pushToken: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
  }
);

// Match user-entered password to hashed-password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = bcrypt.hashSync(this.password, salt);
});

const User = mongoose.model('User', userSchema);

export default User;
