<p><b>node-todo-api</b></p>

<p>Using node and MongoDB and Mongoose to create an API for a ToDo app.</p>

<p>New to MongoDB and Mongoose so I used the playground folder to get more familiar
with some of the commands. Keeping that there for reference.</p>

<p>This repository also contains Mocha unit test scripts for all functionality of the API. You can run these tests with a custom
script using nodemon 'npm run test-watch'.</p>

<p>This API allows you to create user with a provided email and password. Signing up will automatically provide you with a token, otherwise a token will be provided after successful log in. Once a token has been received you can make requsts to add 'todo' tasks, update, retrieve, and delete them.<br />
All information is held in a mongoDB database hosted through Heroku. User information (password) is encrypted before being stored in the database.</p>

<br />
<hr>

<p>This API is available on heroku: <a href="https://sheltered-hollows-47895.herokuapp.com/" target="_blank">https://sheltered-hollows-47895.herokuapp.com/</a></p>

<p><b>Requests for Todos:</b></p>
<li>GET - (all todos) URL: /todos</li>
<li>GET - (single todo) URL: /todos/ID-TO-RETRIEVE</li>
<li>POST - (create todo) URL: /todos</li>
<li>DELETE - URL: /todos/ID-TO-DELETE</li>
<li>PATCH - URL: /todos/ID-TO-PATCH</li>

<p><b>Requests for Users:</b></p>
<li>POST - (create user) URL: /users</li>
<li>POST - (login) URL: /users/login</li>
<li>GET - (retrieve user email from x-auth token) URL: /users/me</li>
<li>DELETE - (logout) URL: /users/me/token</li>

<br />
<hr>

<p><b>Data:</b></p>

<b>Todo:</b>

<li>text - (string) - text describing the todo task</li>
<li>completed - (boolean) - if task is completed or not</li>
<li>completedAt - (number) - timestamp of when the task was completed</li>

<br />

<b>User:</b>
<li>email - (string) - email / used for authentication - unique</li>
<li>password - (string) - password - hashed before saving to DB</li>

<br />
<hr>

<p><b>Authentication and Validation / Tokens</b></p>
<p>User authentication is handled with email and password. The passwords are hashed before being stored in the database. For
reference I left several hashing example files in the playground folder as I find this is a very interesting topic.</p>