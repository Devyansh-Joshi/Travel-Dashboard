import { useEffect, useState } from "react";

const API_BASE = "http://localhost:4000";

function formatDuration(iso) {
  if (typeof iso !== "string") return "N/A";

  const h = iso.match(/(\d+)H/);
  const m = iso.match(/(\d+)M/);

  const hours = h ? Number(h[1]) : 0;
  const mins = m ? Number(m[1]) : 0;

  return `${hours ? hours + "h " : ""}${mins ? mins + "m" : ""}`.trim();
}

function mapAmadeusFlights(flights) {
  return flights.map((f, idx) => {
    const itinerary = f.itineraries[0];

    console.log("FLIGHT", idx, "DURATION RAW:", itinerary?.duration);

    return {
      provider: f.validatingAirlineCodes[0] ?? "N/A",
      duration: formatDuration(itinerary?.duration),
      priceMin: f.price.total,
      priceMax: f.price.total,
      stops: itinerary?.segments?.length ? itinerary.segments.length - 1 : 0,
    };
  });
}

export default function TransportPanel({ trip }) {
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState("flights");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!trip) return;

    async function fetchTransport() {
      setLoading(true);
      try {
        if (activeTab === "flights") {
          const res = await fetch(
            `${API_BASE}/api/transport/flights?from=${
              trip.fromCity.airportCode
            }&to=${trip.city.airportCode}&date=${trip.startDate.slice(0, 10)}`
          );

          const json = await res.json();
          console.log("RAW FLIGHT DATA:", json);
          setData(json);
        } else {
          // mock fallback for now
          setData([]);
        }
      } catch (err) {
        console.error(err);
        setData([]);
      } finally {
        setLoading(false);
      }
    }

    fetchTransport();
  }, [trip, activeTab]);

  if (!trip) return null;
  if (loading) return <p>Loading transport options…</p>;
  if (!data) return null;

  const options =
    activeTab === "flights" ? mapAmadeusFlights(data || []) : data || [];

  return (
    <div style={{ marginTop: "1rem", borderTop: "1px solid #333" }}>
      {/* Tabs */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "0.5rem" }}>
        {["flights"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              fontWeight: activeTab === tab ? "bold" : "normal",
            }}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Content */}
      {options.length === 0 && (
        <p style={{ fontSize: "0.9rem" }}>No {activeTab} available.</p>
      )}

      {options.map((opt, idx) => (
        <div
          key={idx}
          style={{
            border: "1px solid #444",
            padding: "0.5rem",
            marginBottom: "0.5rem",
            borderRadius: 6,
          }}
        >
          <strong>{opt.provider}</strong>
          <div>Duration: {opt.duration}</div>
          <div>
            Price: ₹{opt.priceMin} – ₹{opt.priceMax}
          </div>
          {opt.stops !== undefined && <div>Stops: {opt.stops}</div>}
        </div>
      ))}
    </div>
  );
}
