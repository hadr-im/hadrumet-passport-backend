const express = require('express');
const router = express.Router();
const {getEventById, createEvent, updateEvent, deleteEvent, getAllEvents} = require('../controllers/eventController');

router.get('/', getAllEvents);
router.get('/:id', getEventById);
router.post('/', createEvent);
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);

module.exports = router;