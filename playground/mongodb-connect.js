// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb'); //use destructuring instead

// don't need to create this DB first, you can connect, it will create it once you add to it
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  // get the database
  const db = client.db('TodoApp');

  // no need to create the collection first, you can simply add to it to create it
  // insertOne takes two args, the data to insert, and a function with the error or result
  db.collection('Todos').insertOne({
    text: 'something to do',
    completed: false
  }, (err, result) => {
    if (err) {
      return console.log('Unable to insert todo', err);
    }
    console.log(JSON.stringify(result.ops, undefined, 2));
  });

  // insert new doc into Users (name, age, location)
  db.collection('Users').insertOne({
    name: 'someone',
    age: '101',
    location: 'somewhere'
  }, (err, result) => {
    if (err) {
      return console.log('Unable to insert todo', err);
    }
    //console.log(JSON.stringify(result.ops, undefined, 2));
    console.log(result.ops[0]._id.getTimestamp());
  });

  client.close();
});
