import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

// 👇 create a function so type is inferred correctly
const createPrismaClient = () => {
  return new PrismaClient({
    accelerateUrl: process.env.PRISMA_ACCELERATE_URL!,
  }).$extends(withAccelerate());
};

// 👇 infer correct type
type PrismaClientType = ReturnType<typeof createPrismaClient>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientType | undefined;
};

export const db =
  globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}