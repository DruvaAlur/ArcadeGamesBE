// ✅ Correct
import { PrismaClient } from "../../generated/prisma_client/index.js";

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

export default prisma;
