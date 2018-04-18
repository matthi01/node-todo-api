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

  //deleteMany
  db.collection('Todos').deleteMany({text: 'watch scishow'}).then((result) => {
    console.log(result);
  });

  //deleteOne
  db.collection('Todos').deleteOne({text: 'something to do'}).then((result) => {
    console.log(result);
  });

  //findOneAndDelete
  this will actually return the object that it deletes - this is pretty handy
  db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
    console.log(result);
  });

  //findOneAndDelete
  db.collection('Users').findOneAndDelete({_id: new ObjectID('5ad6b90cf941983e1087221f')}).then((result) => {
    console.log(result);
  });

  //deleteMany
  // you don't NEED to take up the promise
  db.collection('Users').deleteMany({name: 'someone'});

//  client.close();
});
