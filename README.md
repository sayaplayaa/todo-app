# ✅ Todo App — Node.js + Prisma + SQLite

Полноценный Todo List с REST API на Express, ORM Prisma и базой данных SQLite.

## 🚀 Быстрый старт

```bash
# 1. Установить зависимости + создать БД
npm run setup

# 2. Запустить сервер
npm run dev

# 3. Открыть в браузере
open http://localhost:3000
```

## 📁 Структура проекта

```
todo-app/
├── server.js              # Express сервер + REST API
├── package.json
├── .env                   # DATABASE_URL и PORT
├── prisma/
│   ├── schema.prisma      # Схема БД (модель Todo)
│   └── dev.db             # SQLite файл (после npm run setup)
└── public/
    └── index.html         # Фронтенд (HTML + CSS + JS)
```

## 🔌 API Endpoints

| Метод  | URL                | Описание                         |
|--------|--------------------|----------------------------------|
| GET    | /api/todos         | Список всех задач                |
| POST   | /api/todos         | Создать задачу                   |
| PATCH  | /api/todos/:id     | Обновить задачу                  |
| DELETE | /api/todos/:id     | Удалить задачу                   |
| DELETE | /api/todos         | Удалить выполненные задачи       |
| GET    | /api/stats         | Статистика                       |

### Параметры фильтрации (GET /api/todos)
- `?completed=true/false` — фильтр по статусу
- `?priority=high/medium/low` — фильтр по приоритету
- `?category=work` — фильтр по категории
- `?search=текст` — поиск по названию

### Тело запроса (POST / PATCH)
```json
{
  "title": "Название задачи",
  "priority": "high",      // high | medium | low
  "category": "work",      // general | work | personal | shopping | health | learning
  "completed": false
}
```

## 🛠 Другие команды

```bash
npm run db:studio   # Открыть Prisma Studio (GUI для БД)
npm run db:migrate  # Применить новые миграции
npm run db:generate # Регенерировать Prisma Client
```

## 🧩 Модель данных

```prisma
model Todo {
  id        Int      @id @default(autoincrement())
  title     String
  completed Boolean  @default(false)
  priority  String   @default("medium")
  category  String   @default("general")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```
