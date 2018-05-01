const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const validator = require('validator');

const { Schema } = mongoose;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email',
    },
  },
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
  },
  password: {
    type: String,
    require: true,
    minlength: 6,
  },
  hosting: [
    {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Game',
    },
  ],
  playing: [
    {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Game',
    },
  ],
  friends: [
    {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  ],
  pendingFriends: [
    {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  ],
  friendRequests: [
    {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  ],
  tokens: [
    {
      access: {
        type: String,
        required: true,
      },
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

UserSchema.methods.generateAuthToken = function generateAuthToken() {
  const User = this;
  const access = 'auth';
  const token = jwt
    .sign({ _id: User._id.toHexString(), access }, process.env.JWT_SECRET)
    .toString();

  User.tokens.push({ access, token });

  return User.save().then(() => token);
};

UserSchema.methods.removeToken = function removeToken(token) {
  const User = this;

  return User.update({
    $pull: {
      tokens: { token },
    },
  });
};

UserSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    cb(err, isMatch);
  });
};

UserSchema.statics.findByToken = function findByToken(token) {
  const User = this;
  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    return Promise.reject();
  }

  return User.findOne({
    _id: decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth',
  });
};

UserSchema.statics.findByCredentials = function findByCredentials(email, password) {
  const User = this;

  return User.findOne({ email }).then((user) => {
    if (!user) {
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          resolve(user);
        } else {
          reject();
        }
      });
    });
  });
};

UserSchema.pre('save', function save(next) {
  const User = this;

  if (User.isModified('password')) {
    bcrypt.genSalt(10, (saltErr, salt) => {
      if (saltErr) {
        next(saltErr);
        return;
      }
      bcrypt.hash(User.password, salt, (hashErr, hash) => {
        if (hashErr) {
          next(hashErr);
          return;
        }
        User.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
