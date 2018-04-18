const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');


const app = express();

// set up middleware
// body-parser will take the json and convert it into and obj
// the return from .json() is a func, which is the middleware express needs
app.use(bodyParser.json());

// set up routes for basic CRUD operations / each express route takes two args - URL and callback (with request and response objects)
// take the data and create a new mongoose model, then save that model to the db
app.post('/todos', (req, res) => {
  const todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    // this will send data such as the _id back to the user, along with other properties from the model
    res.send(doc);
  }, (err) => {
    // if it couldn't save it was probably due to bad data - 400 - Bad Request
    res.status(400).send(err);
  });
});

// GET all todos in collection
app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    // instead of just sending the array, create an object to add a few more properties
    res.send({todos: todos});
  }, (err) => {
    res.status(400).send(err);
  })
});

//GET single todo - ':id' available in req.params - key being url param
app.get('/todos/:id', (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send();
  }

  Todo.findById(req.params.id).then((todo) => {
    if (!todo) {
      res.status(404).send();
    }
    res.send({todo: todo});
  }).catch((err) => res.status(400).send());
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});

// need to export to be able to use in testing suite
module.exports = {app};