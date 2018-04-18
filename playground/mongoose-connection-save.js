const mongoose = require('mongoose');

// tell mongoose which promise library to use
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

// in mongo, documents (records) in the same collection (table) can have different properties
// mongoose lets you create models to organize this and define what properties the documents must have (check out mongoose validators)
const Todo = mongoose.model('Todo', {
  text: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  }
});

const User = mongoose.model('User', {
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  }
});

// let newTodo = new Todo({
//   text: 'watch scishow'
// });
//
// newTodo.save().then((doc) => {
//   console.log('Saved: ', doc);
// }, (err) => {
//   console.log('Save Failed');
// });


// let secondTodo = new Todo({
//   text: 'do something'
// });
//
// secondTodo.save().then((doc) => {
//   console.log(JSON.stringify(doc, undefined, 2));
// }, (err) => {
//   console.log('Save Failed');
// });

let newUser = new User({
  email: 'something@somewhere.com'
});

newUser.save().then((doc) => {
  console.log(JSON.stringify(doc, undefined, 2));
}, (err) => {
  console.log('Save Failed');
});
