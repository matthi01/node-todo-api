const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

// need a schema to be able to tack methods onto the model
let UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

UserSchema.methods.generateAuthToken = function() {
  let user = this;
  let access = 'auth';
  let token = jwt.sign({_id: user._id.toHexString(), access: access}, 'somethingsecret').toString();

  //user.tokens.push({token, access}); - not sure why this is causing a problem
  user.tokens = user.tokens.concat([{access, token}]);

  return user.save().then(() => {
    return token;
  });
};

// going to override this method - don't want to return all the information in this model (like the password)
UserSchema.methods.toJSON = function() {
  let user = this;
  let userObject = user.toObject(); //user is the mongoose model at this point

  return _.pick(userObject, ['_id', 'email']);
};


const User = mongoose.model('User', UserSchema);

module.exports = {User};