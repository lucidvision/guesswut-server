const { Router } = require('express');

const { register, login, logout } = require('./users');

const Routes = new Router();

Routes.post('/register', register);
Routes.post('/login', login);
Routes.delete('/logout', logout);

module.exports = Routes;
