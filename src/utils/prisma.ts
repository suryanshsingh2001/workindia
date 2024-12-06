import { PrismaClient } from '@prisma/client';




/**
 * Prisma client instance.
 * @remarks
 * This instance is used to interact with the database using Prisma Client.
 * @example
 * const user = await prisma.user.findUnique({ where: { id: 1 } });
 * console.log(user);
 * @see https://www.prisma.io/docs/concepts/components/prisma-client Prisma Client
 * 
 */


const prisma = new PrismaClient();

export default prisma;