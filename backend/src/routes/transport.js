const express = require("express");
const axios = require("axios");
const { getAmadeusToken } = require("../services/amadeus");
// import express from "express";
// import axios from "axios";

const router = express.Router();

router.get("/flights", async (req, res) => {
  try {
    const { from, to, date } = req.query;
    if (!from || !to || !date) {
      return res.status(400).json({ error: "Missing params" });
    }

    const token = await getAmadeusToken();

    const response = await axios.get(
      "https://test.api.amadeus.com/v2/shopping/flight-offers",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          originLocationCode: from,
          destinationLocationCode: to,
          departureDate: date,
          adults: 1,
          max: 5,
        },
      }
    );

    res.json(response.data.data);
  } catch (err) {
    console.error("AMADEUS ERROR:", err.response?.data || err.message);

    res.status(500).json({
      error: "Flight search failed",
      details: err.response?.data || err.message,
    });
  }
});

router.post("/options", async (req, res) => {
  const { fromCity, toCity, startDate } = req.body;

  if (!fromCity || !toCity || !startDate) {
    return res.status(400).json({ error: "Missing input" });
  }

  try {
    // MOCK for now
    const options = {
      flights: [
        {
          provider: "Sample Airlines",
          duration: "7h 30m",
          priceRange: "₹35k–₹55k",
        },
      ],
      trains: [
        {
          provider: "Railways",
          duration: "48h",
          priceRange: "₹8k–₹15k",
        },
      ],
    };

    res.json(options);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Transport lookup failed" });
  }
});

module.exports = router;
