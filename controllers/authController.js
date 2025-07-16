const { readJSONFile } = require('../utils/fileHelper');
const path = require('path');
const jwt = require('jsonwebtoken');

const usersFile = path.join(__dirname, '../data/users.json');
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

const loginEP = async (req, res) => {
  const { appID, password } = req.body;
  console.log(appID, password);

  const users = await readJSONFile(usersFile);
  const user = users.find(u => u.applicationId === appID && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // ✅ Génération du token (expire dans 3 jours)
  const token = jwt.sign(
    { applicationId: user.applicationId },
    JWT_SECRET,
    { expiresIn: '3d' }
  );

  console.log(`✅ User authenticated: ${user.fullName}`);

  // ✅ Ne pas renvoyer tout l’objet user avec password
  const { fullName, email, role, applicationId } = user;

  res.json({
    message: 'Login successful',
    token,
    user: {
      fullName,
      email,
      role,
      applicationId
    }
  });
};

module.exports = {
  loginEP
};
