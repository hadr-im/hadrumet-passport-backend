const express = require('express');
const router = express.Router();
const { loginEP } = require('../controllers/authController');
const authenticateToken = require('../middleware/authmiddleware');
const { readJSONFile } = require('../utils/fileHelper');
const path = require('path');

const usersFile = path.join(__dirname, '../data/users.json');

router.post('/login', loginEP);

// 🔒 Route protégée
router.get('/me', authenticateToken, async (req, res) => {
  const users = await readJSONFile(usersFile);
  const user = users.find(u => u.applicationId === req.user.applicationId);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json({ user: user });
});

module.exports = router;
