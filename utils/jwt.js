const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';

function generateToken(applicationId) {
    return jwt.sign({ applicationId}, JWT_SECRET, {expriresIn: '3d'});
}

function verifyToken(token) {
    try {
        return jwt.verify(token,JWT_SECRET);

    }catch (error) {
        return null;
    }
}

module.exports = {
    generateToken,
    verifyToken
}