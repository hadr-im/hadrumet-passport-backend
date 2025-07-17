const path = require('path');
const { readJSONFile } = require('../utils/fileHelper');

const getRealizedEps = async (req, res) => {
    const usersPath = path.join(__dirname, '../data/users.json');
    try {
        const users = await readJSONFile(usersPath);
        const realizedEps = users.filter(user => user.realized === true).map(user => ({
            fullName: user.fullName,
            phone: user.phone || '',
            picture: user.picture || '',
            nationality: user.mc || '',
            programme: user.opportunity?.programmeId || ''
        }));
        res.json(realizedEps);
    } catch (err) {
        res.status(500).json({ error: 'Failed to read or parse users.json' });
    }
};

module.exports = { getRealizedEps };