<p><b>node-todo-api</b></p>

<p>Using node and MongoDB and Mongoose to create an API for a ToDo app.</p>

<p>New to MongoDB and Mongoose so I used the playground folder to get more familiar
with some of the commands. Keeping that there for reference.</p>

<p>This repository also contains Mocha unit test scripts for all functionality of the API. You can run these tests with a custom
script using nodemon 'npm run test-watch'.</p>

<br />
<hr>

<p>This API is available on heroku: <a href="https://sheltered-hollows-47895.herokuapp.com/" target="_blank">https://sheltered-hollows-47895.herokuapp.com/</a></p>

<p><b>Use:</b></p>
<li>GET - (all todos) URL: /todos</li>
<li>GET - (single todo) URL: /todos/ID-TO-RETRIEVE</li>
<li>POST - URL: /todos</li>
<li>DELETE - URL: /todos/ID-TO-DELETE</li>
<li>PATCH - URL: /todos/ID-TO-PATCH</li>

<br />
<hr>

<p><b>Data:</b></p>

<b>Todo:</b>

<li>text - (string) - text describing the todo task</li>
<li>completed - (boolean) - if task is completed or not</li>
<li>completedAt - (number) - timestamp of when the task was completed</li>

<br />

<b>User:</b>

<br />
<hr>

<p><b>Authentication and Validation / Tokens</b></p>
<p>User authentication is handled with email and password. The passwords are hashed before being stored in the database. For
reference I left several hashing example files in the playground folder as I find this is a very interesting topic.</p>