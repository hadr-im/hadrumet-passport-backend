const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { readJSONFile, writeJSONFile } = require('../utils/fileHelper');

const localAppsFile = path.join(__dirname, '../data/localApps.json');

// Get all localApps
const getAllLocalApps = async (req, res) => {
  const apps = await readJSONFile(localAppsFile);
  res.json(apps);
};

// Get localApp by ID
const getLocalAppById = async (req, res) => {
  const apps = await readJSONFile(localAppsFile);
  const app = apps.find(a => a.id === req.params.id);
  if (!app) return res.status(404).json({ message: 'LocalApp not found' });
  res.json(app);
};

// Create localApp (id is generated with uuid)
const createLocalApp = async (req, res) => {
  const { name, androidLink, iosLink, picture } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'name is required' });
  }
  const apps = await readJSONFile(localAppsFile);
  // Optionally, check for duplicate name if needed
  // if (apps.find(a => a.name === name)) {
  //   return res.status(409).json({ message: 'LocalApp with this name already exists' });
  // }
  const newApp = { id: uuidv4(), name, androidLink, iosLink, picture };
  apps.push(newApp);
  await writeJSONFile(localAppsFile, apps);
  res.status(201).json(newApp);
};

// Update localApp by ID
const updateLocalApp = async (req, res) => {
  const apps = await readJSONFile(localAppsFile);
  const index = apps.findIndex(a => a.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'LocalApp not found' });
  apps[index] = { ...apps[index], ...req.body };
  await writeJSONFile(localAppsFile, apps);
  res.json(apps[index]);
};

// Delete localApp by ID
const deleteLocalApp = async (req, res) => {
  let apps = await readJSONFile(localAppsFile);
  const app = apps.find(a => a.id === req.params.id);
  if (!app) return res.status(404).json({ message: 'LocalApp not found' });
  apps = apps.filter(a => a.id !== req.params.id);
  await writeJSONFile(localAppsFile, apps);
  res.json({ message: 'LocalApp deleted' });
};

module.exports = {
  getAllLocalApps,
  getLocalAppById,
  createLocalApp,
  updateLocalApp,
  deleteLocalApp
};
