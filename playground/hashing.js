const jwt = require('jsonwebtoken');

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