const express = require("express");
const { PrismaClient } = require("./generated/prisma_client");
require("dotenv").config();
const passport = require("passport");
const cors = require("cors");
const routes = require("./src/routes/index");

const app = express();
app.use(cors());
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
