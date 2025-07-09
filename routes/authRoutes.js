const express = require('express');
const router = express.Router();
const { loginEP } = require('../controllers/authController');

router.post('/login', loginEP);

module.exports = router;