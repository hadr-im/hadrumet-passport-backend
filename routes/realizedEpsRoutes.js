const express = require('express');
const { getRealizedEps } = require('../controllers/realizedEpsController');

const router = express.Router();

router.get('/', getRealizedEps);

module.exports = router;
