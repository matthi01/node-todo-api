const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const seedTodoData = [{
    text: 'First test todo'
}, {
    text: 'Second test todo' 
}];

// lifecycle method - runs before every test case - use to set up the database / add some seed data
beforeEach((done) => { 
    Todo.remove({}).then(() => {
        Todo.insertMany(seedTodoData);
    }).then(() => done());
});

describe('POST /todos', () => {

    // async test - need to specify 'done'
    it('should create a new todo', (done) => {
        const text = 'Test todo text';

        // instead of passing done into .end(), want to check what's in the mongo collection, so pass a function, call done if there's an error
        request(app)
            .post('/todos')
            .send({text: text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((err) => done(err));
            });
    });

    it('should not create todo with invalid body data', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                // make sure nothing was put into the DB
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(seedTodoData.length);
                    done();
                }).catch((err) => done(err));
            });
    });
});


describe('GET /todos', () => {

    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(seedTodoData.length);
            })
            .end(done);
    });

});