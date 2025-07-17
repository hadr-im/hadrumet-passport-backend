const express = require('express');
const router = express.Router();
const path = require('path');
const { readJSONFile } = require('../utils/fileHelper');

const categoriesFile = path.join(__dirname, '../data/categories.json');

router.get('/', async (req, res) => {
  const categories = await readJSONFile(categoriesFile);
  res.json(categories);
});

module.exports = router;
