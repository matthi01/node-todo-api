const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {seedTodoData, seedUsersData, populateUsers, populateTodos} = require('./seed/seed');

// lifecycle method - runs before every test case - use to set up the database / add some seed data
//beforeEach(populateUsers); //NEED TO FIX!!!
beforeEach(populateTodos);

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

describe('GET /todos/:id', () => {

    it('should return todo doc', (done) => {
        request(app)
            .get(`/todos/${seedTodoData[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(seedTodoData[0].text);
            })
            .end(done);
    });

    it('should return a 404 (Not Found) error code if ID not found', (done) => {
        request(app)
            .get(`/todos/${new ObjectID().toHexString()}`)
            .expect(404)
            .end(done);
    });

    it('should return a 400 (Bad Data) error code if ID not valid', (done) => {
        request(app)
            .get(`/todos/${new ObjectID().toHexString()}` + 'invalidID')
            .expect(400)
            .end(done);
    });

});

describe('DELETE /todos/:id', () => {

    it('should delete todo doc', (done) => {
        let hexId = seedTodoData[0]._id.toHexString();

        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(seedTodoData[0].text);
            })
            // check the db to make sure it was removed
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.findById(hexId).then((todo) => {
                    expect(todo).toBeNull();
                    done();
                }).catch((err) => done(err));
            });
    });

    it('should return a 404 (Not Found) error code if ID not found', (done) => {
        request(app)
            .delete(`/todos/${new ObjectID().toHexString()}`)
            .expect(404)
            .end(done);
    });

    it('should return a 400 (Bad Data) error code if ID not valid', (done) => {
        request(app)
            .delete(`/todos/${new ObjectID().toHexString()}` + 'invalidID')
            .expect(400)
            .end(done);
    });

});

describe('PATCH /todos/:id', () => {

    it('should update todo doc', (done) => {
        let hexId = seedTodoData[0]._id.toHexString();
        let updateText = 'Test Update';

        request(app)
            .patch(`/todos/${hexId}`)
            .send({text: updateText, completed: true})
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(updateText);
                expect(res.body.todo.completed).toBe(true);
                //expect(res.body.todo.completedAt).toExist();
            })
            .end(done);
        });


    it('should clear completedAt when todo is not completed', (done) => {
        let hexId = seedTodoData[1]._id.toHexString();
        let updateText = 'Test Update 2';

        request(app)
            .patch(`/todos/${hexId}`)
            .send({text: updateText, completed: false})
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(updateText);
                expect(res.body.todo.completed).toBe(false);
                //expect(res.body.todo.completedAt).toNotExist();
            })
            .end(done);
        });
});


describe('GET /users/me', () => {

    it('should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', seedUsersData[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(seedUsersData[0]._id.toHexString());
                expect(res.body.email).toBe(seedUsersData[0].email);
            })
            .end(done);
    });

    it('should return a 401 if not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });
});


describe('POST /users/me', () => {

    it('should create a user', (done) => {
        let email = 'three@test.com';
        let password = '@Password1';

        request(app)
            .post('/users')
            .send({email, password})
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeTruthy();
                expect(res.body._id).toBeTruthy();
                expect(res.body.email).toBe(email);
            })
            .end((err) => {
                if (err) {
                    return done(err);
                }

                User.findOne().then((user) => {
                    expect(user).toBeTruthy();
                    expect(user.password).not.toBe(password);
                    done();
                }).catch((err) => done(err));
            });
    });

    it('should return validation errors if request invalid', (done) => {
        let email = 'wrongemail';
        let password = '1';

        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .end(done);
    });

    it('should not create a user if email in use', (done) => {
        let email = 'three@test.com';
        let password = '@Password1';

        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .end(done);
    });
});

describe('POST /users/login', () => {

    it('should login user and return auth token', (done) => {
        request(app)
            .post('/users/login')
            .send({email: seedUsersData[1].email, password: seedUsersData[1].password})
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth'].toExist());
            })
            .end((err, res) => {
                if (err) {
                    done(err);
                }

                User.findById(seedUsersData[1]._id).then((user) => {
                    expect(user.tokens[0]).toInclude({
                        access: 'auth',
                        token: res.headers['x-auth']
                    });
                    done();
                }).catch((err) => done(err));
            });
    });

    it('should reject invalid login', (done) => {
        request(app)
            .post('/users/login')
            .send({email: 'wrongemail', password: 'wrongpassword'})
            .expect(400)
            .expect((res) => {
                expect(res.headers['x-auth'].toNotExist());
            })
            .end((err, res) => {
                if (err) {
                    done(err);
                }

                User.findById(seedUsersData[1]._id).then((user) => {
                    expect(user.tokens[0].length).toBe(0);
                    done();
                }).catch((err) => done(err));
            });
    });
});