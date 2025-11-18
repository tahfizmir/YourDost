This is a simple REST API built using Node.js + Express. It manages ToDo items 
in memory no database required! Useful for learning CRUD operations or testing UI.


Base URL

http://localhost:3000


Endpoints Summary

GET    /todos        → List all todos
POST   /todos        → Create a new todo
PUT    /todos/:id    → Update a todo
DELETE /todos/:id    → Delete a todo



1. GET all todos

GET http://localhost:3000/todos

Response:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Learn REST APIs",
      "completed": false,
      "createdAt": "2025-01-01T12:00:00.000Z",
      "updatedAt": "2025-01-01T12:00:00.000Z"
    }
  ]
}

2. POST create a todo

POST http://localhost:3000/todos
Content-Type: application/json

Body:
{
  "title": "Build Todo Backend",
  "completed": false
}

Response:
{
  "success": true,
  "data": { ... }
}

3. PUT update a todo

PUT http://localhost:3000/todos/1
Content-Type: application/json

Body:
{
  "title": "Update Todo Task",
  "completed": true
}

4. DELETE a todo

DELETE http://localhost:3000/todos/1


Steps to run the server:

clone the repo
cd backend
npm install
node simpleTodoCrudApi.js


Uses in-memory storage → all data resets when the server restarts.
Includes input validation and a "completed" boolean field.

