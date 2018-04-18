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

  //standard query - pass the desired key value pairs
  // db.collection('Todos').find({completed: false}).toArray().then((docs) => {
  //   console.log('Todos');
  //   console.log(JSON.stringify(docs, undefined, 2));
  // }, (err) => {
  //   console.log('Unable to fetch todos');
  // });

  //if querying by the object ID you need to use the ObjectID constructor, passing it in as a string won't work
  // db.collection('Todos').find({
  //   _id: new ObjectID('5ad6bb35f588e990d9abfeb6')
  // }).toArray().then((docs) => {
  //   console.log('Todos');
  //   console.log(JSON.stringify(docs, undefined, 2));
  // }, (err) => {
  //   console.log('Unable to fetch todos');
  // });


  // use count curser method instead of toArray
  db.collection('Todos').find().count().then((count) => {
    console.log('Todos count: ' + count);
  }, (err) => {
    console.log('Unable to fetch todos');
  });


//  client.close();
});
