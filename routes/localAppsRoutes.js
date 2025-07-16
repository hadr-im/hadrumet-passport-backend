const express = require('express');
const router = express.Router();
const {
  getAllLocalApps,
  getLocalAppById,
  createLocalApp,
  updateLocalApp,
  deleteLocalApp
} = require('../controllers/localAppsController');

router.get('/', getAllLocalApps);
router.get('/:id', getLocalAppById);
router.post('/', createLocalApp);
router.put('/:id', updateLocalApp);
router.delete('/:id', deleteLocalApp);

module.exports = router;
