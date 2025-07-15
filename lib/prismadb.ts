import { PrismaClient } from "@prisma/client";

declare global {
  // This makes TS happy with the global type
  var prisma: PrismaClient | undefined;
}

const prismadb = globalThis.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prismadb;
}

export default prismadb;
