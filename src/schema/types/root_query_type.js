const mongoose = require('mongoose');
const graphql = require('graphql');
const UserType = require('./user_type');
const GameType = require('./game_type');

const { GraphQLObjectType } = graphql;

const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      resolve(parentValue, args, req) {
        return req.user;
      },
    },
    game: {
      type: GameType,
      resolve(parentValue, { id }) {
        const Game = mongoose.model('Game');
        return Game.findById(id);
      },
    },
  },
});

module.exports = RootQueryType;
