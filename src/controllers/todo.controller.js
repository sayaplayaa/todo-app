const todoService = require('../services/todo.service');

// ─── GET /api/todos ───────────────────────────────────────────────────────────
async function getAll(req, res) {
  try {
    const todos = await todoService.getAllTodos(req.query);
    res.json({ success: true, data: todos, count: todos.length });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

// ─── GET /api/todos/:id ───────────────────────────────────────────────────────
async function getOne(req, res) {
  try {
    const todo = await todoService.getTodoById(parseInt(req.params.id));
    if (!todo) return res.status(404).json({ success: false, error: 'Todo not found' });
    res.json({ success: true, data: todo });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

// ─── POST /api/todos ──────────────────────────────────────────────────────────
async function create(req, res) {
  try {
    const todo = await todoService.createTodo(req.body);
    res.status(201).json({ success: true, data: todo });
  } catch (error) {
    const status = error.message === 'Title is required' ? 400 : 500;
    res.status(status).json({ success: false, error: error.message });
  }
}

// ─── PATCH /api/todos/:id ─────────────────────────────────────────────────────
async function update(req, res) {
  try {
    const todo = await todoService.updateTodo(parseInt(req.params.id), req.body);
    if (!todo) return res.status(404).json({ success: false, error: 'Todo not found' });
    res.json({ success: true, data: todo });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

// ─── DELETE /api/todos/:id ────────────────────────────────────────────────────
async function remove(req, res) {
  try {
    const todo = await todoService.deleteTodo(parseInt(req.params.id));
    if (!todo) return res.status(404).json({ success: false, error: 'Todo not found' });
    res.json({ success: true, message: 'Todo deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

// ─── DELETE /api/todos (все выполненные) ──────────────────────────────────────
async function removeCompleted(req, res) {
  try {
    const result = await todoService.deleteCompletedTodos();
    res.json({ success: true, message: `Deleted ${result.count} completed todos` });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

// ─── GET /api/stats ───────────────────────────────────────────────────────────
async function getStats(req, res) {
  try {
    const stats = await todoService.getStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = { getAll, getOne, create, update, remove, removeCompleted, getStats };
