const morgan = require('morgan');
const bodyParser = require('body-parser');

const { checkAuth } = require('./auth');

const middleware = (app) => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(morgan('dev'));
  app.use(checkAuth);
};

module.exports = middleware;
