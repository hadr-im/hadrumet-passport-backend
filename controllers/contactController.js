const path = require('path');
const { readJSONFile, writeJSONFile } = require('../utils/fileHelper');
const { v4: uuidv4 } = require('uuid');

const CONTACT_FILE = path.join(__dirname, '../data/contacts.json');

exports.getAllContacts = async (req, res) => {
    const contacts = await readJSONFile(CONTACT_FILE);
    res.json(contacts);
}

exports.getContactById = async (req, res) => {
    const contacts = await readJSONFile(CONTACT_FILE);
    const contact = contacts.find(c => c.id === req.params.id);
    if(!contact) {
        return res.status(404).json({ message: 'Contact not found' });
    }
    res.json(contact);
}

exports.createContact = async (req, res) => {
  const { fullName, role, phone, picture, facebookLink } = req.body;
  if (!fullName || !role || !phone) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  const newContact = {
    id: uuidv4(),
    fullName,
    picture,
    role,
    phone,
    facebookLink
  };

  const contacts = await readJSONFile(CONTACT_FILE);
  contacts.push(newContact);
  await writeJSONFile(CONTACT_FILE, contacts);

  res.status(201).json(newContact);
}

exports.updateContact = async (req, res) => {
    const contacts = await readJSONFile(CONTACT_FILE);
    const index = contacts.findIndex(c => c.id === req.params.id);
    if(index === -1) return res.status(404).json({ message: 'Contact not found' });

    contacts[index] = {
        ...contacts[index],
        ...req.body
    };

    await writeJSONFile(CONTACT_FILE, contacts);
    res.json(contacts[index]);
}

exports.deleteContact = async (req, res) => {
    let contacts = await readJSONFile(CONTACT_FILE);
    const contact = contacts.find(c => c.id === req.params.id);
    if(!contact){
        return res.status(404).json({ message: 'Contact not found' });
    }
    contacts = contacts.filter(c => c.id !== req.params.id);
    await writeJSONFile(CONTACT_FILE, contacts);
    res.json({ message: 'Contact deleted successfully' });
}