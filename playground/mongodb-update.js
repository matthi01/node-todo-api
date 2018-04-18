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

  // findOneAndUpdate (filter, update, options, callback)
  // look up update operators and get familiar with some of these
  db.collection('Todos').findOneAndUpdate({
    _id: new ObjectID('5ad6b90cf941983e1087221e')
  }, {
    $set: {
      completed: false
    }
  }, {
    returnOriginal: false
  }).then((result) => {
    console.log(result);
  });


  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID('5ad6d1b5f588e990d9ac0519')
  }, {
    $set: {
      name: 'vitt'
    },
    $inc: {
      age: 1
    }
  }, {
    returnOriginal: false
  }).then((result) => {
    console.log(result);
  });

//  client.close();
});
