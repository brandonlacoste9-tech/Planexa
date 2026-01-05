import { PrismaClient } from '@prisma/client';

console.log('Initializing Prisma Client...');
const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});
console.log('Prisma Client initialized.');

export default prisma;
