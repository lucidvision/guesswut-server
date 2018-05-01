const mongoose = require('mongoose');

const { Schema } = mongoose;

const GameSchema = new Schema({
  completed: {
    type: Boolean,
    default: false,
  },
  guesses: [
    {
      type: Object,
    },
  ],
  host: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  imageUrl: {
    type: String,
  },
  modifiedImageUrl: {
    type: String,
  },
  players: [
    {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  ],
  winner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

const Game = mongoose.model('Game', GameSchema);

module.exports = Game;
