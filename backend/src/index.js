require("dotenv").config();

const express = require("express");
const cors = require("cors");

const cityRoutes = require("./routes/cities");
const tripRoutes = require("./routes/trips");
const transportRoutes = require("./routes/transport");

const app = express();
console.log("🚀 Backend starting");

const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// routes
app.use("/api/cities", cityRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/transport", transportRoutes);
console.log("✅ /api/transport routes mounted");

// health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
