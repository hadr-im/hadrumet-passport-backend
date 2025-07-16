const express = require('express');
const router = express.Router();
const {getAllPlaces, getPlaceById, createPlace, updatePlace, deletePlace, getPlacesByCategory} = require('../controllers/placeController');

router.get('/', getAllPlaces);
router.get('/category/:category_id', getPlacesByCategory);
router.get('/:id', getPlaceById);
router.post('/', createPlace);
router.put('/:id', updatePlace);
router.delete('/:id', deletePlace);

module.exports = router;
