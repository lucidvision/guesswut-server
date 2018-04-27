const graphql = require('graphql');

const {
  GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLID, GraphQLList,
} = graphql;

const GameType = new GraphQLObjectType({
  name: 'GameType',
  fields: {
    id: { type: GraphQLID },
    completed: { type: GraphQLBoolean },
    guesses: { type: new GraphQLList(GraphQLString) },
    host: { type: GraphQLID },
    imageUrl: { type: GraphQLString },
    modifiedImageUrl: { type: GraphQLString },
    players: { type: new GraphQLList(GraphQLID) },
    winner: { type: GraphQLString },
  },
});

module.exports = GameType;
