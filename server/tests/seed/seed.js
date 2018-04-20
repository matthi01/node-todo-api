const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('../../models/todo');
const {User} = require('../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();


// USERS
const seedUsersData = [{
    _id: userOneId,
    email: 'one@test.com',
    password: 'userOnePassword',
    tokens: [{
        access: 'auth', 
        token: jwt.sign({_id: userOneId, access: 'auth'}, 'somethingsecret').toString()
    }]

}, {
    _id: userTwoId,
    email: 'two@test.com',
    password: 'userTwoPassword'
}];


// TODOS
const seedTodoData = [{
    _id: new ObjectID(),
    text: 'First test todo'
}, {
    _id: new ObjectID(),
    text: 'Second test todo',
    completed: true,
    completedAt: 999
}];

// POPULATING DB
const populateUsers = (done) => {
    User.remove({}).then(() => {
        let userOne = new User(seedUsersData[0]).save();
        let userTwo = new User(seedUsersData[1]).save();

        return Promise.all([userOne, userTwo]);
    }).then(() => done()).catch((err) => done(err));
};

const populateTodos = (done) => {
    Todo.remove({}).then(() => {
        Todo.insertMany(seedTodoData);
    }).then(() => done());
};

module.exports = {seedTodoData, seedUsersData, populateUsers, populateTodos};