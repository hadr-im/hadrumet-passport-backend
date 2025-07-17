require('dotenv').config();
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const ADMIN_USERNAME = process.env.USERNAME_ADMIN;
const ADMIN_PASSWORD = process.env.PASSWORD_ADMIN;

const adminLogin = async (req, res) => {
  const { username, password } = req.body;
  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ message: 'Invalid admin credentials' });
  }
  // Generate a JWT token for the admin
  const token = jwt.sign({ username, role: 'admin' }, JWT_SECRET, { expiresIn: '3d' });
  res.json({ message: 'Admin login successful', token, user: { username, role: 'admin' } });
};


module.exports = {
  adminLogin,
};
