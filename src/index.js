require('./config/config');
require('./db/mongoose');

const express = require('express');
const expressGraphQL = require('express-graphql');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const schema = require('./schema');

const app = express();

app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'aaabbbccc',
  store: new MongoStore({
    url: process.env.MONGODB_URI,
    autoReconnect: true,
  }),
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(
  '/graphql',
  expressGraphQL({
    schema,
    graphiql: true,
  }),
);

module.exports = app;
