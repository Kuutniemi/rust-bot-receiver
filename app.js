const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const bodyParser = require("body-parser");

const app = express();
app.use(express.json());
app.use(bodyParser.json());

// Sample route to create a user
app.post("/heliminusone", async (req, res) => {
  try {
    const newEntry = await prisma.heliMinusOne.create({
      data: {
        value: -1,
        who: req.body.who || "Unknown",
      },
    });
    res.status(201).json(newEntry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add -1 to the database" });
  }
});

// Sample route to get all users and count how many today
app.get("/heliminusone", async (req, res) => {
  const allUsers = await prisma.heliMinusOne.findMany({
    select: {
      _count: true,
    },
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayUsers = await prisma.heliMinusOne.count({
    where: {
      createdAt: {
        gte: today,
      },
    },
  });

  res.json({ allUsers, todayUsers });
});

const PORT = 9870;
app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  await prisma.$connect();
});
