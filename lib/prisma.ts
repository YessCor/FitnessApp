import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import pg from 'pg';

const { Pool } = pg;

// Configuración del pool de conexiones
const connectionString = process.env.DATABASE_URL || '';

const pool = new Pool({
  connectionString,
});

const adapter = new PrismaPg(pool);

// En desarrollo, usamos una única instancia para evitar múltiples conexiones
// En producción, esto puede variar dependiendo del entorno

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;