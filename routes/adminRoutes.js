const express = require('express');
const router = express.Router();
const { adminLogin } = require('../controllers/adminController');

// Public admin login
router.post('/login', adminLogin);


module.exports = router;
