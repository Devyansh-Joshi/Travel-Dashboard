import { useState } from "react";
import CitySearch from "./SearchBar";

const API_BASE = "http://localhost:4000";

export default function CreateTripForm({ city, onTripCreated }) {
  const [fromCity, setFromCity] = useState(null);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  if (!city) return null;

  function isValid() {
    if (!fromCity) return false;

    if (!startDate || !endDate) return false;

    const today = new Date().toISOString().split("T")[0];
    if (startDate < today) return false;
    if (endDate < startDate) return false;

    return true;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isValid()) {
      alert("Please check your dates.");
      return;
    }

    setLoading(true);
    try {
      const backendTrip = await fetch(`${API_BASE}/api/trips`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromCityId: fromCity.id,
          cityId: city.id,
          startDate,
          endDate,
          notes,
        }),
      }).then((r) => r.json());

      const frontendTrip = {
        id: backendTrip.id,
        cityId: city.id,
        cityName: city.name,
        cityCountry: city.country,

        fromCityId: fromCity.id,
        fromCityName: fromCity.name,
        fromCityCountry: fromCity.country,
        startDate,
        endDate,
        notes,
        bookmarks: [],
      };

      onTripCreated(frontendTrip);

      setStartDate("");
      setEndDate("");
      setNotes("");
      setFromCity(null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        border: "1px solid #333",
        padding: "0.75rem",
        marginTop: "1rem",
      }}
      className="create-trip-form"
    >
      <h3>Create Trip to {city.name}</h3>

      <div className="form-group">
        <label>From:</label>
        <CitySearch onCitySelect={setFromCity} />
      </div>

      <div className="form-group">
        <label>Start date:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>End date:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Notes:</label>
        <input
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Optional"
        />
      </div>

      <button type="submit" disabled={loading || !isValid()}>
        {loading ? "Creating…" : "Create Trip"}
      </button>
    </form>
  );
}
