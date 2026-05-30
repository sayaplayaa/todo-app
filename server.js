const express = require('express');
const cors = require('cors');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ─── GET all todos ───────────────────────────────────────────────────────────
app.get('/api/todos', async (req, res) => {
  try {
    const { completed, priority, category, search } = req.query;

    const where = {};
    if (completed !== undefined) where.completed = completed === 'true';
    if (priority) where.priority = priority;
    if (category) where.category = category;
    if (search) where.title = { contains: search };

    const todos = await prisma.todo.findMany({
      where,
      orderBy: [{ completed: 'asc' }, { createdAt: 'desc' }],
    });

    res.json({ success: true, data: todos, count: todos.length });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ─── GET single todo ─────────────────────────────────────────────────────────
app.get('/api/todos/:id', async (req, res) => {
  try {
    const todo = await prisma.todo.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (!todo) return res.status(404).json({ success: false, error: 'Todo not found' });
    res.json({ success: true, data: todo });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ─── POST create todo ─────────────────────────────────────────────────────────
app.post('/api/todos', async (req, res) => {
  try {
    const { title, priority = 'medium', category = 'general' } = req.body;
    if (!title || title.trim() === '') {
      return res.status(400).json({ success: false, error: 'Title is required' });
    }

    const todo = await prisma.todo.create({
      data: { title: title.trim(), priority, category },
    });

    res.status(201).json({ success: true, data: todo });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ─── PATCH update todo ────────────────────────────────────────────────────────
app.patch('/api/todos/:id', async (req, res) => {
  try {
    const { title, completed, priority, category } = req.body;
    const id = parseInt(req.params.id);

    const exists = await prisma.todo.findUnique({ where: { id } });
    if (!exists) return res.status(404).json({ success: false, error: 'Todo not found' });

    const todo = await prisma.todo.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(completed !== undefined && { completed }),
        ...(priority !== undefined && { priority }),
        ...(category !== undefined && { category }),
      },
    });

    res.json({ success: true, data: todo });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ─── DELETE todo ──────────────────────────────────────────────────────────────
app.delete('/api/todos/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const exists = await prisma.todo.findUnique({ where: { id } });
    if (!exists) return res.status(404).json({ success: false, error: 'Todo not found' });

    await prisma.todo.delete({ where: { id } });
    res.json({ success: true, message: 'Todo deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ─── DELETE completed todos ───────────────────────────────────────────────────
app.delete('/api/todos', async (req, res) => {
  try {
    const result = await prisma.todo.deleteMany({ where: { completed: true } });
    res.json({ success: true, message: `Deleted ${result.count} completed todos` });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ─── GET stats ────────────────────────────────────────────────────────────────
app.get('/api/stats', async (req, res) => {
  try {
    const [total, completed, byPriority] = await Promise.all([
      prisma.todo.count(),
      prisma.todo.count({ where: { completed: true } }),
      prisma.todo.groupBy({ by: ['priority'], _count: { priority: true } }),
    ]);

    res.json({
      success: true,
      data: {
        total,
        completed,
        pending: total - completed,
        byPriority: byPriority.reduce((acc, p) => {
          acc[p.priority] = p._count.priority;
          return acc;
        }, {}),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ─── Serve frontend ───────────────────────────────────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ─── Start server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Todo App running at http://localhost:${PORT}`);
  console.log(`📊 API docs:`);
  console.log(`   GET    /api/todos          — list todos`);
  console.log(`   POST   /api/todos          — create todo`);
  console.log(`   PATCH  /api/todos/:id      — update todo`);
  console.log(`   DELETE /api/todos/:id      — delete todo`);
  console.log(`   DELETE /api/todos          — clear completed`);
  console.log(`   GET    /api/stats          — statistics\n`);
});

// ─── Graceful shutdown ────────────────────────────────────────────────────────
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
