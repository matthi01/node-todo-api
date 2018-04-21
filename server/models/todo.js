const mongoose = require('mongoose');

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
    },
    _creator: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    }
});

module.exports = {Todo};