// need @prisma/client installation for this
import { PrismaClient } from "@prisma/client";

// declaring global variable
declare global {
    var prisma: PrismaClient | undefined;
};

export const db = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalThis.prisma = db;