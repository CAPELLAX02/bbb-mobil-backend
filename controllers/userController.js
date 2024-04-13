import asyncHandler from '../middleware/asyncHandler.js';
import generateToken from '../utils/generateToken.js';
import User from '../models/userModel.js';
import sendVerificationEmail from '../utils/emailVerificationService.js';
import sendPasswordResetEmail from '../utils/forgotPasswordService.js';

/**
 * @desc    Auth (Login) user
 * @route   POST /api/users/auth
 * @access  Public
 */
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });
  if (user && (await user.matchPassword(password)) && user.isEmailVerified) {
    const { regularUserToken } = generateToken(user._id);

    res.json({
      regularUserToken, // will be kept in Expo SecureStore
      _id: user._id,
      name: user.name,
      surname: user.surname,
      phone: user.phone,
      email: user.email,
      isAdmin: user.isAdmin,
      isEmailVerified: user.isEmailVerified,
    });
  } else {
    res.status(401);
    throw new Error('Geçersiz e-posta veya şifre!');
  }
});

/**
 * @desc    Register a new user
 * @route   POST /api/users
 * @access  Public
 */
const registerUser = asyncHandler(async (req, res) => {
  const { name, surname, phone, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('Bu e-posta adresi zaten kayıtlı.');
  }

  const emailVerificationCode = Math.random().toString().slice(2, 8);
  const emailVerificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);

  const user = await User.create({
    name,
    surname,
    phone,
    email,
    password, // Password hashing should be handled by your User model's middleware
    emailVerificationCode,
    emailVerificationCodeExpires,
    isEmailVerified: false, // Initially false
  });

  if (user) {
    await sendVerificationEmail(user.email, emailVerificationCode);
    res.status(201).json({
      message: 'Doğrulama kodu gönderildi. Lütfen e-postanızı kontrol edin.',
    });
  } else {
    res.status(400);
    throw new Error('Kullanıcı oluşturulamadı.');
  }
});

/**
 * @desc    Log out user & clear cookie
 * @route   POST /api/users/logout
 * @access  Public
 */
const logoutUser = (req, res) => {
  res.status(200).json({ message: 'Logged out successfully.' });
};

/**
 * @desc    Get user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      surname: user.surname,
      phone: user.phone,
      email: user.email,
      isAdmin: user.isAdmin,
      isEmailVerified: user.isEmailVerified,
    });
  } else {
    res.status(404);
    throw new Error('Kullanıcı bulunamadı.');
  }
});

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.name = req.body.name || user.name;
    user.surname = req.body.surname || user.surname;
    // EMAIL** ve TELEFON numarası için tekrar verification fonksiyonu tetiklenecek kullanıcı bu ikisini değiştirip 'değişiklikleri' kaydet derse!
    // user.phone = req.body.phone || user.phone
    // user.email = req.body.email || user.email
    if (req.body.password) {
      user.password = req.body.password;
    }
    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      surname: updatedUser.surname,
      phone: updatedUser.phone,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      isEmailVerified: updatedUser.isEmailVerified,
    });
  } else {
    res.status(404);
    throw new Error('Kullanıcı bulunamadı.');
  }
});

/**
 * @desc    Send verification mail to user
 * @route   POST /api/users/verify-email
 * @access  Private
 */
const verifyEmail = asyncHandler(async (req, res) => {
  const { email, verificationCode } = req.body;

  const user = await User.findOne({
    email,
    emailVerificationCode: verificationCode,
    emailVerificationCodeExpires: { $gt: Date.now() },
  });

  if (user) {
    user.isEmailVerified = true;
    user.emailVerificationCode = undefined; // Clear verification code
    user.emailVerificationCodeExpires = undefined; // Clear code expiration
    await user.save();

    res.json({ message: 'E-posta başarıyla doğrulandı!' });
  } else {
    res
      .status(400)
      .json({ message: 'Geçersiz veya süresi dolmuş doğrulama kodu!' });
  }
});

/**
 * @desc    Send password reset email
 * @route   POST /api/users/forgot-password
 * @access  Public
 */
const sendForgotPasswordEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email });

  if (user) {
    const resetPasswordCode = Math.random().toString().slice(2, 8);
    user.resetPasswordCode = resetPasswordCode;
    user.resetPasswordCodeExpires = Date.now() + 10 * 60 * 1000;

    await user.save();

    await sendPasswordResetEmail(user.email, resetPasswordCode);

    res.status(200).json({
      messsage: 'Şifre sıfırlama kodu e-posta adresine gönderildi.',
    });
  } else {
    res.status(404);
    throw new Error('Kullanıcı bulunamadı.');
  }
});

/**
 * @desc    Reset password
 * @route   POST /api/users/reset-password
 * @access  Private
 */
const resetPassword = asyncHandler(async (req, res) => {
  const { email, resetPasswordCode, newPassword } = req.body;

  if (!email || !resetPasswordCode || !newPassword) {
    res.status(404);
    throw new Error('Eksik bilgi girildi. Tüm alanları doldurun.');
  }

  const user = await User.findOne({
    email: email,
    resetPasswordCode: resetPasswordCode,
    resetPasswordCodeExpires: { $gt: Date.now() }, // Kodun süresi hala geçerli mi kontrol et
  });

  if (!user) {
    res.status(404);
    throw new Error('Geçersiz kullanıcı veya süresi dolmuş doğrulama kodu.');
  }

  const isSamePassword = await user.matchPassword(newPassword);

  if (isSamePassword) {
    res.status(400);
    throw new Error('Yeni şifreniz eski şifrenizle aynı olamaz.');
  }

  user.password = newPassword;
  user.resetPasswordCode = undefined;
  user.resetPasswordCodeExpires = undefined;

  await user.save();

  res.status(200).json({
    message:
      'Şifre başarıyla sıfırlandı. Yeni şifrenizle giriş yapabilirsiniz.',
  });
});

/**
 * @desc    Update user push token
 * @route   PUT /api/users/push-token
 * @access  Private
 */
const updateUserPushToken = asyncHandler(async (req, res) => {
  const { pushToken } = req.body;
  // req.user.id, protect middleware'ı tarafından ayarlanmış olmalıdır
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    return;
  }

  user.pushToken = pushToken;
  await user.save();

  res.json({ message: 'Push token başarıyla güncellendi.' });
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  verifyEmail,
  sendForgotPasswordEmail,
  resetPassword,
  updateUserPushToken,
};
