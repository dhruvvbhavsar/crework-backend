const jwt = require('../utils/jwt');
const User = require('../models/user');
const Session = require('../models/session');

exports.authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verifyToken(token);
    
    const session = await Session.findOne({ userId: decoded.userId, token, expiresAt: { $gt: new Date() } });
    if (!session) {
      throw new Error();
    }
    
    const user = await User.findById(decoded.userId).select('-passwordHash');
    if (!user) {
      throw new Error();
    }
    
    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Please authenticate' });
  }
};