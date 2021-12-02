const jwt = require('jsonwebtoken');
const env = require('../env');

const withAuth = function (req, res, next) {
  let token = req.cookies.token;

  if (req.headers.authorization) {
    token = req.headers.authorization;
  }

  if (!token) {
    res.status(401).send('Unauthorized: No token provided');
  } else {
    jwt.verify(token, env.secret, function (err, decoded) {
      if (err) {
        res.status(401).send('Unauthorized: Invalid token');
      } else {
        req.email = decoded.email;
        next();
      }
    });
  }
};
module.exports = withAuth;
