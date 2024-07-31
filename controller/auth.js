const authService = require('../service/auth');

exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const user = await authService.registerUser(email,password, name);
    res.status(201).json({ message: 'User registered successfully', userId: user._id });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.loginUser(email, password);
    res.json({ message: 'Login successful', token, userId: user._id });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    await authService.logoutUser(req.user._id, req.token);
    res.json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProfile = async (req, res) => {
  res.json({ user: req.user });
};