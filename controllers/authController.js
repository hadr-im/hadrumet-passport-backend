const { readJSONFile } = require('../utils/fileHelper');
const path = require('path');

const usersFile = path.join(__dirname, '../data/users.json');

const loginEP = async (req,  res) => {
    const { epID, password } = req.body;

    const users = await readJSONFile(usersFile);
    const user = users.find(u => u.email === epID && u.password === password);

    if(!user){
        return res.status(401).json({message : "Invalid credentials"});
    }

    res.json({ message : "Login successful", user});
}

module.exports = {
    loginEP
};
