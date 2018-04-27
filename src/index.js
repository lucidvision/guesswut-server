require('./config/config');
require('./db/mongoose');
require('./models');
const express = require('express');
const expressGraphQL = require('express-graphql');
const middleware = require('./middleware');
const routes = require('./routes');
const schema = require('./schema');

const app = express();

middleware(app);

app.use('/api', routes);

app.use(
  '/graphql',
  expressGraphQL({
    schema,
    graphiql: true,
  }),
);

module.exports = app;
