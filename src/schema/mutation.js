const graphql = require('graphql');

const { GraphQLObjectType, GraphQLString } = graphql;
const UserType = require('./types/user_type');

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
  },
});

module.exports = mutation;
