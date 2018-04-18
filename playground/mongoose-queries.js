const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');

const id = '5ad7b89bf26bc4377c31d329';

if (!ObjectID.isValid(id)) {
    console.log('ID not valid.');
}

// .find() returns everything that matches the query - returns array - empty arr if nothing 
// cool - mongoose will actually convert the string into an Object ID - no need to do it manually
Todo.find({
    _id: id
}).then((todos) => {
    console.log('Todos', todos);
});

// .findOne() returns only the first item that matches the query - returns object or null
Todo.findOne({
    _id: id
}).then((todo) => {
    console.log('Todo', todo);
});

// can only search by id returns object or null
// shit.. keep in mind, if id is valid this doesn't return an error, but null, so the success case is still going to fire, need an if to handle this
Todo.findById(id).then((todo) => {
    if (!todo) {
        return console.log('Id not found');
    }
    console.log('Todo', todo);
}).catch((err) => {
    console.log(err);
});