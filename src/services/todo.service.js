const prisma = require('../prisma/client');

// ─── Получить все задачи (с фильтрами) ───────────────────────────────────────
async function getAllTodos({ completed, priority, category, search } = {}) {
  const where = {};

  if (completed !== undefined) where.completed = completed === 'true';
  if (priority)                where.priority  = priority;
  if (category)                where.category  = category;
  if (search)                  where.title     = { contains: search };

  return prisma.todo.findMany({
    where,
    orderBy: [{ completed: 'asc' }, { createdAt: 'desc' }],
  });
}

// ─── Получить одну задачу ─────────────────────────────────────────────────────
async function getTodoById(id) {
  return prisma.todo.findUnique({ where: { id } });
}

// ─── Создать задачу ───────────────────────────────────────────────────────────
async function createTodo({ title, priority = 'medium', category = 'general' }) {
  if (!title || title.trim() === '') {
    throw new Error('Title is required');
  }

  return prisma.todo.create({
    data: { title: title.trim(), priority, category },
  });
}

// ─── Обновить задачу ──────────────────────────────────────────────────────────
async function updateTodo(id, { title, completed, priority, category }) {
  const exists = await getTodoById(id);
  if (!exists) return null;

  return prisma.todo.update({
    where: { id },
    data: {
      ...(title     !== undefined && { title: title.trim() }),
      ...(completed !== undefined && { completed }),
      ...(priority  !== undefined && { priority }),
      ...(category  !== undefined && { category }),
    },
  });
}

// ─── Удалить задачу ───────────────────────────────────────────────────────────
async function deleteTodo(id) {
  const exists = await getTodoById(id);
  if (!exists) return null;

  return prisma.todo.delete({ where: { id } });
}

// ─── Удалить все выполненные ──────────────────────────────────────────────────
async function deleteCompletedTodos() {
  return prisma.todo.deleteMany({ where: { completed: true } });
}

// ─── Статистика ───────────────────────────────────────────────────────────────
async function getStats() {
  const [total, completed, byPriority] = await Promise.all([
    prisma.todo.count(),
    prisma.todo.count({ where: { completed: true } }),
    prisma.todo.groupBy({ by: ['priority'], _count: { priority: true } }),
  ]);

  return {
    total,
    completed,
    pending: total - completed,
    byPriority: byPriority.reduce((acc, p) => {
      acc[p.priority] = p._count.priority;
      return acc;
    }, {}),
  };
}

module.exports = {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  deleteCompletedTodos,
  getStats,
};
