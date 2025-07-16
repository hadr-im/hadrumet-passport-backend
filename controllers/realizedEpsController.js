const fs = require('fs');
const path = require('path');

const getRealizedEps = (req, res) => {
    const usersPath = path.join(__dirname, '../users.json');
    fs.readFile(usersPath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read users.json' });
        }
        try {
            const users = JSON.parse(data);
            // Assuming each user has an 'eps' array
            const realizedEps = [];
            users.forEach(user => {
                if (Array.isArray(user.eps)) {
                    user.eps.forEach(ep => {
                        if (ep.realized === true) {
                            realizedEps.push(ep);
                        }
                    });
                }
            });
            res.json(realizedEps);
        } catch (parseErr) {
            res.status(500).json({ error: 'Failed to parse users.json' });
        }
    });
};

module.exports = { getRealizedEps };