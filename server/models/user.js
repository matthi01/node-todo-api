const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

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

// statics instead of methods.. this just turns the method into a static - or a model method
// because its a model method and not an instance method, 'this' will refer to the model User not instance user
UserSchema.statics.findByToken = function(token) {
  let User = this;
  let decoded;
  
  try {
    decoded = jwt.verify(token, 'somethingsecret')
  } catch (err) {
    return Promise.reject();
  }

  // note: to access nested properties, wrap the value in quotes (if there is a . in the full property name)
  return User.findOne({
    _id: decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });

};

// going to override this method - don't want to return all the information in this model (like the password)
UserSchema.methods.toJSON = function() {
  let user = this;
  let userObject = user.toObject(); //user is the mongoose model at this point

  return _.pick(userObject, ['_id', 'email']);
};

// using a regular function to get access to 'this'
// using this middleware to make some changes to the schema before saving it - hasing the passwords
UserSchema.pre('save', function(next) {
  let user = this;
  
  if (user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });

  } else {
    next();
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = {User};