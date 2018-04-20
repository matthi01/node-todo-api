const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

//using bcrypt
let password = '@Password1';

//genSalt() takes an argument of how many rounds you want to use - this is slow and will prevent brute force attacks
bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
        console.log(hash);
    });
});


let hashedPassword = '$2a$10$yzih7sMAEtiwnK1GQ9ZefO7PfAQJEgjMMsjVOJgY.6Jk2TyWgiD16';

bcrypt.compare(password, hashedPassword, (err, res) => {
    console.log(res);
});



// this library really only has two functions, one to create tokens, and one to verify them

let data = {
    id: 10
};

// takes the data and the salt - this secret string is used as the signature verification
let token = jwt.sign(data, 'secretStringSALT');
console.log('token: ', token);


let decoded = jwt.verify(token, 'secretStringSALT');
console.log('decoded: ', decoded);


// this will throw an error for an invalid signature
let decodedChanged = jwt.verify(token, 'wrongSecretString');
console.log('decodedChanged: ', decodedChanged);