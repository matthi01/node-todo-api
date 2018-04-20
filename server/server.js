require('../server/config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticate');



const app = express();
const port = process.env.PORT;

// set up middleware
// body-parser will take the json and convert it into and obj
// the return from .json() is a func, which is the middleware express needs
app.use(bodyParser.json());


// *********** TODO ROUTES ***********

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

app.delete('/todos/:id', (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send();
  }

  Todo.findByIdAndRemove(req.params.id).then((todo) => {
    if (!todo) {
      res.status(404).send();
    }
    res.send({todo});
  }).catch((err) => res.status(400).send());
});

app.patch('/todos/:id', (req, res) => {
  let id = req.params.id;
  let body = _.pick(req.body, ['text', 'completed']); //don't want users to update anything else
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send();
  }

  if(_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
    if (!todo) {
      return res.status(404).send()
    }
    res.send({todo});

  }).catch((err) => {
    res.status(400).send();
  });
});

// ***********************************


// *********** USER ROUTES ***********

// POST /users
app.post('/users', (req, res) => {
  const body = _.pick(req.body, ['email', 'password']);
  const user = new User(body);

  user.save().then((user) => {
    return user.generateAuthToken();
    //res.send(user);
  }).then((token) => {
    // header with 'x-' is a custom header
    res.header('x-auth', token).send(user);
  })
  .catch((err) => {
    res.status(400).send(err);
  });
});

// ***********************************

// to use the middleware, add it as a parameter to the route
app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});


// POST /users/login
app.post('/users/login', (req, res) => {
  const body = _.pick(req.body, ['email','password']);

  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((err) => {
    res.status(400).send();
  });
});



app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

// need to export to be able to use in testing suite
module.exports = {app};