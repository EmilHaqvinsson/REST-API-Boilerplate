#Todo application
### RESTful API with CRUD-functionality
The example code will function as a To Do-application backend.

##### Installation
Run `npm install` while stadning in the root. You will also need to have MongoDB installed and running, alternatively running in a Docker-container. There is a `.env_template` file included in the repo, using the information in that file you need to create a file called `.env` in the root of the project. 

##### Included endpoints
- `/` Check if the server is up and running.
- `/todos`
  - Send a GET-request to this endpoint to fetch all TODOs from the database.
  - Send a POST-request to this endpoint to create a new TODO in the database.
- `/todos/undone` 
  - Send a GET-request to this endpoint to see all the undone TODOs.
- `/todos/:id` 
  - Send a GET-request to this endpoint (replacing `:id` with an actual ID from the database) to see information about that specific TODO. This will include the task itself, wether its done, when it was created and when it was last updated. 
  - Send a PUT-Request to update a TODO in the database. 
  - Send a DELETE-request to delete a TODO from the database.