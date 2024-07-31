const User = require('../models/user');
const Session = require('../models/session');
const jwt = require('../utils/jwt');

exports.registerUser = async (email, password, name) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('Email already exists');
  }
  
  const user = new User({ name, email, passwordHash: password });
  await user.save();
  return user;
};

exports.loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    throw new Error('Invalid email or password');
  }
  
  const token = jwt.generateToken(user);
  const session = new Session({
    userId: user._id,
    token: token,
    expiresAt: jwt.getTokenExpiration(),
  });
  await session.save();
  
  return { user, token };
};

exports.logoutUser = async (userId, token) => {
  await Session.findOneAndDelete({ userId, token });
};

exports.getUserById = async (userId) => {
  return User.findById(userId).select('-passwordHash');
};