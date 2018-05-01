const graphql = require('graphql');
const mongoose = require('mongoose');

const {
  GraphQLObjectType, GraphQLID, GraphQLString, GraphQLList,
} = graphql;
const UserType = require('./types/user_type');
const GameType = require('./types/game_type');

const User = mongoose.model('User');
const Game = mongoose.model('Game');

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
        const game = new Game(args);
        User.findById(args.host).then((host) => {
          host.hosting.push(game._id);
          host.save();
        });
        User.find({ _id: { $in: args.players } }).then((users) => {
          users.forEach((player) => {
            player.playing.push(game._id);
            player.save();
          });
        });

        return game.save();
      },
    },
    findFriend: {
      type: UserType,
      args: {
        email: { type: GraphQLString },
      },
      resolve(parentValue, { email }) {
        return User.findOne({ email });
      },
    },
    sendFriendRequest: {
      type: UserType,
      args: {
        friendId: { type: GraphQLID },
      },
      resolve(parentValue, { friendId }, req) {
        User.findById(friendId).then((friend) => {
          friend.friendRequests.push(friendId);
          friend.save();
        });

        req.user.pendingFriends.push(friendId);
        return req.user.save();
      },
    },
    acceptFriendRequest: {
      type: UserType,
      args: {
        friendId: { type: GraphQLID },
      },
      resolve(parentValue, { friendId }, req) {
        User.findById(friendId).then((friend) => {
          const newFriend = friend;
          newFriend.pendingFriends.remove(req.user._id);
          newFriend.friends.push(req.user._id);
          newFriend.save();
        });

        req.user.friendRequests.remove(friendId);
        req.user.friends.push(friendId);
        return req.user.save();
      },
    },
  },
});

module.exports = mutation;
