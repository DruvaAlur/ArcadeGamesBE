import prisma from "../db/prisma.client.js";
import bcrypt from "bcryptjs";

const registerUser = async (userData) => {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  return prisma.user.create({
    data: {
      email: userData.email,
      password: hashedPassword,
    },
  });
};

const loginUser = async ({ email, password }) => {
  console.log("in login");

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    user = registerUser({ email, password });
    console.log(user);
  }
  if (!(await bcrypt.compare(password, user.password))) {
    throw new Error("Invalid credentials");
  }
  return user;
};
export default { loginUser };
