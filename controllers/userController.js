const path = require('path');
const { readJSONFile, writeJSONFile } = require('../utils/fileHelper');

const usersFile = path.join(__dirname, '../data/users.json');

// Get all users
const getAllUsers = async (req, res) => {
  const users = await readJSONFile(usersFile);
  res.json(users);
};

// Get user by ID
const getUserById = async (req, res) => {
  const users = await readJSONFile(usersFile);
  const user = users.find(u => u.applicationId === req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
};

// Update user by ID
const updateUser = async (req, res) => {
  const users = await readJSONFile(usersFile);
  const index = users.findIndex(u => u.applicationId === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'User not found' });
  users[index] = { ...users[index], ...req.body };
  await writeJSONFile(usersFile, users);
  res.json(users[index]);
};

// Delete user by ID
const deleteUser = async (req, res) => {
  let users = await readJSONFile(usersFile);
  const user = users.find(u => u.applicationId === req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  users = users.filter(u => u.applicationId !== req.params.id);
  await writeJSONFile(usersFile, users);
  res.json({ message: 'User deleted' });
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};
