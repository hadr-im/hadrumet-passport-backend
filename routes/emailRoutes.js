const express = require('express');
const router = express.Router();
const path = require('path');
const { readJSONFile } = require('../utils/fileHelper');
const { sendEmail } = require('../controllers/emailController');
const usersFile = path.join(__dirname, '../data/users.json');


router.post('/', async (req, res) => {
  const { applicationId } = req.body;

  if (!applicationId) {
    return res.status(400).json({ message: 'applicationId is required' });
  }

  const users = await readJSONFile(usersFile);
  const index = users.findIndex(u => u.applicationId === applicationId);

  if (index === -1) {
    return res.status(404).json({ message: 'User not found' });
  }

  const user = users[index];

  if (!user.email) {
    return res.status(400).json({ message: 'User has no email' });
  }


  try {
    await sendEmail(user.applicationId, user.password, user.email, user.fullName);
    res.json({ message: 'Activation email sent successfully' });
  } catch (err) {
    console.error('Email error:', err);
    res.status(500).json({ message: 'Failed to send email' });
  }
});

module.exports = router;
