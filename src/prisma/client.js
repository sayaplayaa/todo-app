const { PrismaClient } = require('@prisma/client');

// Singleton — один инстанс на всё приложение
const prisma = new PrismaClient();

module.exports = prisma;
