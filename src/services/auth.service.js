import prisma from "../db/prisma.client.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config/index.js";

export const registerUser = async (userData) => {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  return prisma.user.create({
    data: {
      email: userData.email,
      password: hashedPassword,
    },
  });
};

export const loginUser = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error("Invalid credentials");
  }
  return jwt.sign({ userId: user.id }, config.JWT_SECRET, { expiresIn: "1h" });
};
