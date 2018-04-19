
// NOT ACTUALLY USING THIS... JUST PLAYING AROUND

const {SHA256} = require('crypto-js');

let message = 'I am a user';
let hash = SHA256(message).toString();

console.log(`Message: ${message}`);
console.log(`Hash: ${hash}`);


let data = {
    id: 4
};

// the token is going to be comprised of user data such as the ID. To be able to store it securely and validate logins from our side 
// we will store the hash. However, to stop a user from changing the user data part of this token and re-hashing it into a valid hash
// we need to SALT the hash. Salting a hash means including a secret random string that is not known to users in the hash. This will 
// stop users from being able to create a valid hash for another user
let token = {
    data: data,
    hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
};

// this is to simulate the hash coming from the user - using the same salt
let resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

// if the hash is identical, the data was not manipulated
if (resultHash === token.hash) {
    console.log('Data was not changed')
} else {
    console.log('Data was changed')
}


// if someone tries to manipulate the token. They do not have access to the Salt (somesecret)
// so the changed hash will not equal the stored hash for user id 5
token.data.id = 5;
token.hash = SHA256(JSON.stringify(token.data)).toString();

if (resultHash === token.hash) {
    console.log('Data was not changed')
} else {
    console.log('Data was changed')
}