const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const bodyParser = require("body-parser");

const app = express();
app.use(express.json());
app.use(bodyParser.json());

// Sample route to create a user
app.post("/heliminusone", async (req, res) => {
  console.log("Request for -1 received:", req.body);
  try {
    const newEntry = await prisma.heliMinusOne.create({
      data: {
        value: -1,
        who: req.body.who || "Unknown",
      },
    });

    // Fetch updated total count
    const totalCount = await prisma.heliMinusOne.count();

    // Fetch updated daily count
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dailyCount = await prisma.heliMinusOne.count({
      where: {
        when: {
          gte: today, // Start of today
          lt: new Date(today.getTime() + 86400000), // Start of tomorrow
        },
      },
    });

    res.status(201).json({
      newEntry,
      totalCount,
      dailyCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add -1 to the database" });
  }
});

app.get("/heliminusone", async (req, res) => {
  try {
    const helis = await prisma.heliMinusOne.findMany({});

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayHelis = await prisma.heliMinusOne.count({
      where: {
        when: {
          gte: today, // Start of today
          lt: new Date(today.getTime() + 86400000), // Start of tomorrow
        },
      },
    });

    res
      .status(200)
      .send(`Helis fucked today: ${todayHelis}. Total: ${helis.length}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to retrieve data");
  }
});

app.get("/heliminusone/stats", async (req, res) => {
  try {
    const stats = await prisma.heliMinusOne.groupBy({
      by: ["who"],
      _count: {
        value: true,
      },
    });

    const formattedStats = stats.map((stat) => ({
      who: stat.who,
      count: stat._count.value,
    }));

    res.status(200).json(formattedStats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve stats" });
  }
});

const PORT = 9870;
app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  await prisma.$connect();
});
