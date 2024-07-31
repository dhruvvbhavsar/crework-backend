const jwt = require('jsonwebtoken');

exports.generateToken = (user) => {
  return jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION
  });
};

exports.verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

exports.getTokenExpiration = () => {
  const expiration = process.env.JWT_EXPIRATION;
  const time = expiration.slice(0, -1);
  const unit = expiration.slice(-1);
  
  const date = new Date();
  switch(unit) {
    case 'h': date.setHours(date.getHours() + parseInt(time)); break;
    case 'd': date.setDate(date.getDate() + parseInt(time)); break;
    case 'm': date.setMinutes(date.getMinutes() + parseInt(time)); break;
    default: throw new Error('Invalid JWT expiration format');
  }
  
  return date;
};