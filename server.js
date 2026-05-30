const express = require('express');
const cors    = require('cors');
const path    = require('path');
const prisma  = require('./src/prisma/client');
const todoRoutes = require('./src/routes/todo.routes');

const app  = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/todos', todoRoutes);

// ─── Frontend fallback ────────────────────────────────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Todo App running at http://localhost:${PORT}`);
  console.log(`   Routes → Controllers → Services → Prisma → SQLite\n`);
});

// ─── Graceful shutdown ────────────────────────────────────────────────────────
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
