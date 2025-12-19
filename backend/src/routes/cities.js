const express = require("express");
const axios = require("axios");
const prisma = require("../prisma");

const router = express.Router();
const OPENWEATHER_KEY = process.env.OPENWEATHER_API_KEY;

/**
 * SEARCH CITY (Geocoding)
 */
router.get("/search", async (req, res) => {
  const q = req.query.q;
  if (!q) return res.status(400).json([]);

  try {
    const geoRes = await axios.get(
      "https://api.openweathermap.org/geo/1.0/direct",
      {
        params: {
          q,
          limit: 5,
          appid: process.env.OPENWEATHER_API_KEY,
        },
      }
    );

    const cities = [];

    for (const g of geoRes.data) {
      const city = await prisma.city.upsert({
        where: {
          name_country: {
            name: g.name,
            country: g.country,
          },
        },
        update: {},
        create: {
          name: g.name,
          country: g.country,
          lat: g.lat,
          lon: g.lon,
        },
      });

      cities.push(city);
    }

    res.json(cities);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "City search failed" });
  }
});

/**
 * WEATHER (5-day forecast)
 */
router.get("/:id/weather", async (req, res) => {
  try {
    const cityId = Number(req.params.id);
    if (Number.isNaN(cityId)) {
      return res.status(400).json({ error: "Invalid city id" });
    }

    const city = await prisma.city.findUnique({ where: { id: cityId } });
    if (!city) return res.status(404).json({ error: "City not found" });

    const now = new Date();

    // Cache check (30 mins)
    if (city.lastWeatherFetch && now - city.lastWeatherFetch < 30 * 60 * 1000) {
      const cached = await prisma.weatherCache.findMany({
        where: { cityId },
        orderBy: { date: "asc" },
      });
      return res.json({ city, source: "cache", days: cached });
    }

    const wxRes = await axios.get(
      "https://api.openweathermap.org/data/2.5/forecast",
      {
        params: {
          lat: city.lat,
          lon: city.lon,
          units: "metric",
          appid: OPENWEATHER_KEY,
        },
      }
    );

    // group by date
    const byDate = {};
    for (const entry of wxRes.data.list) {
      const date = entry.dt_txt.split(" ")[0];
      if (!byDate[date]) byDate[date] = entry;
    }

    const daily = Object.entries(byDate).map(([date, data]) => ({
      date: new Date(date),
      data,
    }));

    await prisma.weatherCache.deleteMany({ where: { cityId } });

    await prisma.$transaction(
      daily.map((d) =>
        prisma.weatherCache.create({
          data: {
            cityId,
            date: d.date,
            data: d.data,
          },
        })
      )
    );

    await prisma.city.update({
      where: { id: cityId },
      data: { lastWeatherFetch: now },
    });

    const fresh = await prisma.weatherCache.findMany({
      where: { cityId },
      orderBy: { date: "asc" },
    });

    res.json({ city, source: "api", days: fresh });
  } catch (err) {
    console.error(err.response?.data || err);
    res.status(500).json({ error: "Failed to fetch weather" });
  }
});

/**
 * ATTRACTIONS (Geoapify Places API)
 */
router.get("/:id/attractions", async (req, res) => {
  try {
    const cityId = Number(req.params.id);
    if (Number.isNaN(cityId)) {
      return res.status(400).json({ error: "Invalid city id" });
    }

    const city = await prisma.city.findUnique({ where: { id: cityId } });
    if (!city) {
      return res.status(404).json({ error: "City not found" });
    }

    const API_KEY = process.env.GEOAPIFY_API_KEY;
    if (!API_KEY) {
      return res.status(500).json({ error: "Geoapify API key missing" });
    }

    const response = await axios.get("https://api.geoapify.com/v2/places", {
      params: {
        categories: "tourism.sights,tourism.attraction",
        filter: `circle:${city.lon},${city.lat},5000`,
        limit: 10,
        apiKey: API_KEY,
      },
    });

    const places = response.data.features || [];

    // Clear old attractions
    await prisma.attraction.deleteMany({ where: { cityId } });

    if (places.length) {
      await prisma.$transaction(
        places.map((p) =>
          prisma.attraction.create({
            data: {
              cityId,
              name: p.properties.name || "Unknown",
              category: p.properties.categories?.join(", "),
              lat: p.geometry.coordinates[1],
              lon: p.geometry.coordinates[0],
              externalId: p.properties.place_id,
              data: p,
            },
          })
        )
      );
    }

    const saved = await prisma.attraction.findMany({
      where: { cityId },
      take: 20,
    });

    res.json({ city, attractions: saved });
  } catch (err) {
    console.error(err.response?.data || err);
    res.status(500).json({ error: "Failed to fetch attractions" });
  }
});

/**
 * CITY DASHBOARD
 * Returns: city + weather + attractions
 */
router.get("/:id/dashboard", async (req, res) => {
  try {
    const cityId = Number(req.params.id);
    if (Number.isNaN(cityId)) {
      return res.status(400).json({ error: "Invalid city id" });
    }

    console.log("Dashboard request for city:", cityId);

    // 1️⃣ Fetch city
    const city = await prisma.city.findUnique({
      where: { id: cityId },
    });

    if (!city) {
      return res.status(404).json({ error: "City not found" });
    }

    const now = new Date();

    // 2️⃣ WEATHER (reuse cache logic)
    let weatherSource = "cache";
    let weatherDays = [];

    const cacheValid =
      city.lastWeatherFetch && now - city.lastWeatherFetch < 30 * 60 * 1000;

    if (cacheValid) {
      weatherDays = await prisma.weatherCache.findMany({
        where: { cityId },
        orderBy: { date: "asc" },
      });
    } else {
      const wxRes = await axios.get(
        "https://api.openweathermap.org/data/2.5/forecast",
        {
          params: {
            lat: city.lat,
            lon: city.lon,
            units: "metric",
            appid: process.env.OPENWEATHER_API_KEY,
          },
        }
      );

      const byDate = {};
      for (const entry of wxRes.data.list) {
        const date = entry.dt_txt.split(" ")[0];
        if (!byDate[date]) byDate[date] = entry;
      }

      const daily = Object.entries(byDate).map(([date, data]) => ({
        date: new Date(date),
        data,
      }));

      await prisma.weatherCache.deleteMany({ where: { cityId } });

      await prisma.$transaction(
        daily.map((d) =>
          prisma.weatherCache.create({
            data: {
              cityId,
              date: d.date,
              data: d.data,
            },
          })
        )
      );

      await prisma.city.update({
        where: { id: cityId },
        data: { lastWeatherFetch: now },
      });

      weatherDays = await prisma.weatherCache.findMany({
        where: { cityId },
        orderBy: { date: "asc" },
      });

      weatherSource = "api";
    }

    // 3️⃣ ATTRACTIONS (Geoapify, fault-tolerant)
    let attractions = [];

    try {
      attractions = await prisma.attraction.findMany({
        where: { cityId },
        take: 20,
      });

      if (attractions.length === 0) {
        const geoRes = await axios.get("https://api.geoapify.com/v2/places", {
          params: {
            categories: "tourism.sights,tourism.attraction",
            filter: `circle:${city.lon},${city.lat},5000`,
            limit: 20,
            apiKey: process.env.GEOAPIFY_API_KEY,
          },
        });

        const places = geoRes.data.features || [];

        if (places.length > 0) {
          await prisma.$transaction(
            places.map((p) =>
              prisma.attraction.create({
                data: {
                  cityId,
                  name: p.properties.name || "Unknown",
                  category: p.properties.categories?.join(", "),
                  lat: p.geometry.coordinates[1],
                  lon: p.geometry.coordinates[0],
                  externalId: p.properties.place_id,
                  data: p,
                },
              })
            )
          );

          attractions = await prisma.attraction.findMany({
            where: { cityId },
            take: 20,
          });
        }
      }
    } catch (err) {
      console.error("Attractions fetch failed:", err.message);
      attractions = [];
    }

    // 4️⃣ TRIPS (NEW — include fromCity + destination city)
    const trips = await prisma.trip.findMany({
      where: { cityId },
      include: {
        city: true, // destination
        fromCity: true, // source
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // 5️⃣ FINAL RESPONSE
    res.json({
      city,
      weather: {
        source: weatherSource,
        days: weatherDays,
      },
      attractions,
      trips,
    });
  } catch (err) {
    console.error(err.response?.data || err);
    res.status(500).json({ error: "Failed to load dashboard" });
  }
});

module.exports = router;
