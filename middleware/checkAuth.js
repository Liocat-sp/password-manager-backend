const jwt = require('jsonwebtoken');
const HttpError = require('../util/HttpError');

module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next();
    }
    try {
        console.log(req.headers.authorization);
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            throw new HttpError('Authorization Failed.');
        }
        const decodedToken = jwt.verify(token, 'superdupersecret');
        req.userData = { userId: decodedToken.userId };
        next();
    }
    catch (error) {
        return next(new HttpError('You are not authorized.', 401));
    }

}; 