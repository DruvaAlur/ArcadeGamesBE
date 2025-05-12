import express from "express";
import { PrismaClient } from "./generated/prisma_client/index.js";
import dotenv from "dotenv";
dotenv.config();
import passport from "passport";
import cors from "cors";
import routes from "./src/routes/index.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(cookieParser());
app.use(
  cors(
    cors({
      origin: "http://localhost:5173", // your frontend URL
      credentials: true, // allow cookies to be sent
    })
  )
);
app.use(passport.initialize());
const prisma = new PrismaClient();

app.use(express.json());
app.use("/api", routes);

// Get all users
app.get("/api", async (req, res) => {
  const userCount = await prisma.user.count();
  res.json(
    userCount == 0
      ? "No users have been added yet."
      : "Some users have been added to the database."
  );
});

// Create a new user
app.post("/api/user", async (req, res) => {
  const { name, email } = req.body;
  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
      },
    });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
