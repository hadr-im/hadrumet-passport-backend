const { readJSONFile } = require('../utils/fileHelper');
const path = require('path');

const usersFile = path.join(__dirname, '../data/users.json');

const loginEP = async (req,  res) => {
    const { appID, password } = req.body;
    console.log(appID, password)

    const users = await readJSONFile(usersFile);
    const user = users.find(u => u.applicationId === appID && u.password === password);
    if(user){
        console.log(`User found: ${user.fullName}`);
    }

    if(!user){
        return res.status(401).json({message : "Invalid credentials"});
    }

    res.json({ message : "Login successful", user});
}

module.exports = {
    loginEP
};
