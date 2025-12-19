const express = require("express");
const prisma = require("../prisma");

const router = express.Router();

// Create trip
router.post("/", async (req, res) => {
  try {
    const { cityId, startDate, endDate, notes } = req.body;
    if (!cityId || !startDate || !endDate) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const trip = await prisma.trip.create({
      data: {
        cityId: Number(cityId),
        fromCityId: req.body.fromCityId ? Number(req.body.fromCityId) : null, // Experimental
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        notes,
      },
      include: { city: true },
    });

    res.json(trip);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create trip" });
  }
});

// List trips
router.get("/", async (req, res) => {
  try {
    const trips = await prisma.trip.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        city: true,
        fromCity: true,
      },
    });
    res.json(trips);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch trips" });
  }
});

module.exports = router;
