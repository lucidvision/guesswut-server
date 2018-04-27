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
    type: String,
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
      ref: 'user',
    },
  ],
  winner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
});

const Game = mongoose.model('Game', GameSchema);

module.exports = Game;
