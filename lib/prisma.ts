import { neon } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';

// Configuración del adapter de Neon
const connectionString = process.env.DATABASE_URL || '';
const sql = neon(connectionString);
const adapter = new PrismaNeon(sql);

// En desarrollo, usamos una única instancia para evitar múltiples conexiones
// En producción, esto puede variar dependiendo del entorno

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;