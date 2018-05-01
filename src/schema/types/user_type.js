const graphql = require('graphql');

const {
  GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList,
} = graphql;

const UserType = new GraphQLObjectType({
  name: 'UserType',
  fields: {
    id: { type: GraphQLID },
    email: { type: GraphQLString },
    name: { type: GraphQLString },
    pendingFriends: { type: new GraphQLList(GraphQLID) },
    friendRequests: { type: new GraphQLList(GraphQLID) },
    friends: { type: new GraphQLList(GraphQLID) },
  },
});

module.exports = UserType;
