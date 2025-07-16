const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { readJSONFile, writeJSONFile } = require('../utils/fileHelper');

const PLACES_FILE = path.join(__dirname, '../data/places.json');

exports.getAllPlaces = async (req, res) => {
  const places = await readJSONFile(PLACES_FILE);
  res.json(places);
};

exports.getPlacesByCategory = async (req, res) => {
  const places = await readJSONFile(PLACES_FILE);
  const byCategory = places.filter(p => p.category_id === req.params.category_id);
  if (byCategory.length === 0) return res.status(404).json({ message: 'No places found for this category' });
  res.json(byCategory);
};

exports.getPlaceById = async (req, res) => {
  const places = await readJSONFile(PLACES_FILE);
  const place = places.find(p => p.id === req.params.id);
  if (!place) return res.status(404).json({ message: 'Place not found' });
  res.json(place);
};

exports.createPlace = async (req, res) => {
  const { name, category_id, location, description, phone, google_maps_url, picture } = req.body;
  if (!name || !category_id) {
    return res.status(400).json({ message: 'name and category_id are required' });
  }

  const newPlace = {
    id: uuidv4(),
    name,
    category_id,
    location: location || '',
    description: description || '',
    phone: phone || '',
    google_maps_url: google_maps_url || '',
    picture: picture || ''
  };

  const places = await readJSONFile(PLACES_FILE);
  places.push(newPlace);
  await writeJSONFile(PLACES_FILE, places);

  res.status(201).json(newPlace);
};

exports.updatePlace = async (req, res) => {
  const places = await readJSONFile(PLACES_FILE);
  const index = places.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Place not found' });

  places[index] = { ...places[index], ...req.body };
  await writeJSONFile(PLACES_FILE, places);
  res.json(places[index]);
};

exports.deletePlace = async (req, res) => {
  let places = await readJSONFile(PLACES_FILE);
  const place = places.find(p => p.id === req.params.id);
  if (!place) return res.status(404).json({ message: 'Place not found' });

  places = places.filter(p => p.id !== req.params.id);
  await writeJSONFile(PLACES_FILE, places);
  res.json({ message: 'Place deleted' });
};
