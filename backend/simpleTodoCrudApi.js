const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;


app.use(cors());
app.use(express.json());


let todos = [];
let nextId = 1; 


function validateTodoInput(body, isCreate = true) {
  const errors = [];

  if (isCreate) {
    if (typeof body.title !== "string" || body.title.trim().length === 0) {
      errors.push("title is required and must be a non-empty string");
    }
  } else {
    if (
      body.title !== undefined &&
      (typeof body.title !== "string" || body.title.trim().length === 0)
    ) {
      errors.push("title must be a non-empty string when provided");
    }
  }

  if (body.completed !== undefined && typeof body.completed !== "boolean") {
    errors.push("completed must be a boolean when provided");
  }

  return errors;
}

// GET /todos 
app.get("/todos", (req, res) => {
  res.status(200).json({
    success: true,
    data: todos,
  });
});

// POST /todos
app.post("/todos", (req, res) => {
  const errors = validateTodoInput(req.body, true);
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      errors,
    });
  }

  const { title, completed = false } = req.body;

  const newTodo = {
    id: nextId++,
    title: title.trim(),
    completed,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  todos.push(newTodo);

  res.status(201).json({
    success: true,
    data: newTodo,
  });
});

// PUT /todos/:id
app.put("/todos/:id", (req, res) => {
  const todoId = parseInt(req.params.id, 10);

  const todo = todos.find((t) => t.id === todoId);
  if (!todo) {
    return res.status(404).json({
      success: false,
      message: "Todo not found",
    });
  }

  const errors = validateTodoInput(req.body, false);
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      errors,
    });
  }

  const { title, completed } = req.body;

  if (title !== undefined) {
    todo.title = title.trim();
  }
  if (completed !== undefined) {
    todo.completed = completed;
  }
  todo.updatedAt = new Date().toISOString();

  res.status(200).json({
    success: true,
    data: todo,
  });
});

// DELETE /todos/:id
app.delete("/todos/:id", (req, res) => {
  const todoId = parseInt(req.params.id, 10);

  const index = todos.findIndex((t) => t.id === todoId);
  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: "Todo not found",
    });
  }

  const deleted = todos.splice(index, 1)[0];

  res.status(200).json({
    success: true,
    data: deleted,
  });
});


app.get("/", (req, res) => {
  res.json({ message: "Todo API is running" });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
