const User = require('./../models/user');

const checkAuth = (req, res, next) => {
  if (req.path === '/api/register' || req.path === '/api/login') {
    next();
    return;
  }

  const token = req.header('x-auth');
  User.findByToken(token)
    .then((user) => {
      req.user = user;
      req.token = token;
      next();
    })
    .catch(() => {
      res.status(401).send('Unauthorized');
    });
};

module.exports = { checkAuth };
