const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const { Schema } = mongoose;

const UserSchema = new Schema({
  email: String,
  password: String,
});

UserSchema.pre('save', function save(next) {
  const user = this;
  if (!user.isModified('password')) {
    next();
    return;
  }
  bcrypt.genSalt(10, (saltErr, salt) => {
    if (saltErr) {
      next(saltErr);
      return;
    }
    bcrypt.hash(user.password, salt, (hashErr, hash) => {
      if (hashErr) {
        next(hashErr);
        return;
      }
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    cb(err, isMatch);
  });
};

mongoose.model('User', UserSchema);
