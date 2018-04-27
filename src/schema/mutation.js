const graphql = require('graphql');
const mongoose = require('mongoose');

const {
  GraphQLObjectType, GraphQLID, GraphQLString, GraphQLList,
} = graphql;
const UserType = require('./types/user_type');
const GameType = require('./types/game_type');

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    editName: {
      type: UserType,
      args: {
        name: { type: GraphQLString },
      },
      resolve(parentValue, { name }, req) {
        const { user } = req;
        user.name = name;
        return user.save();
      },
    },
    createGame: {
      type: GameType,
      args: {
        host: { type: GraphQLID },
        imageUrl: { type: GraphQLString },
        modifiedImageUrl: { type: GraphQLString },
        players: { type: new GraphQLList(GraphQLID) },
      },
      resolve(parentValue, args) {
        const Game = mongoose.model('Game');
        const game = new Game(args);
        return game.save();
      },
    },
  },
});

module.exports = mutation;
