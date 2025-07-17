const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { readJSONFile, writeJSONFile } = require('../utils/fileHelper');

const EVENTS_FILE = path.join(__dirname, '../data/events.json');

exports.getAllEvents = async (req, res) => {
  const events = await readJSONFile(EVENTS_FILE);
  res.json(events);
};

exports.getEventById = async (req, res) => {
  const events = await readJSONFile(EVENTS_FILE);
  const event = events.find(e => e.id === req.params.id);
  if (!event) return res.status(404).json({ message: 'Event not found' });
  res.json(event);
};

exports.createEvent = async (req, res) => {
  const { title, description, location, eventType,startDate, endDate, dayTime, picture } = req.body;
  if (!title || !location || !startDate) {
    return res.status(400).json({ message: 'title, location, and startDate are required' });
  }

  const newEvent = {
    id: uuidv4(),
    title,
    eventType,
    description: description || '',
    location,
    dayTime : dayTime,
    startDate,
    endDate: endDate || null,
    picture: picture || '',
  };
  console.log(newEvent);

  const events = await readJSONFile(EVENTS_FILE);
  events.push(newEvent);
  await writeJSONFile(EVENTS_FILE, events);

  res.status(201).json(newEvent);
};

exports.updateEvent = async (req, res) => {
  const events = await readJSONFile(EVENTS_FILE);
  const index = events.findIndex(e => e.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Event not found' });

  events[index] = { ...events[index], ...req.body };
  await writeJSONFile(EVENTS_FILE, events);
  res.json(events[index]);
};

exports.deleteEvent = async (req, res) => {
  let events = await readJSONFile(EVENTS_FILE);
  const event = events.find(e => e.id === req.params.id);
  if (!event) return res.status(404).json({ message: 'Event not found' });

  events = events.filter(e => e.id !== req.params.id);
  await writeJSONFile(EVENTS_FILE, events);
  res.json({ message: 'Event deleted' });
};
