import { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import CityHeader from "../components/CityHeader";
import WeatherSection from "../components/WeatherSection";
import AttractionsSection from "../components/AttractionsSection";
import AttractionsMap from "../components/AttractionsMap";
import { ATTRACTION_FILTERS } from "../constants/attractionFilters";
import TripsSection from "../components/TripsSection";
import CreateTripForm from "../components/CreateTripForm";
import { loadTripsFromStorage, saveTripsToStorage } from "../utils/tripStorage";

const API_BASE = "http://localhost:4000";

export default function Dashboard() {
  const INITIAL_VISIBLE = 6;
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedAttraction, setSelectedAttraction] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [trips, setTrips] = useState([]);
  const [activeTripId, setActiveTripId] = useState(null);
  const [expandedTripId, setExpandedTripId] = useState(null);

  useEffect(() => {
    const storedTrips = loadTripsFromStorage();

    if (storedTrips.length > 0) {
      setTrips(storedTrips);
    } else {
      fetch("http://localhost:4000/api/trips")
        .then((res) => res.json())
        .then((data) => {
          setTrips(data);
          saveTripsToStorage(data);
        });
    }
  }, []);

  useEffect(() => {
    if (trips.length > 0) {
      saveTripsToStorage(trips);
    }
  }, [trips]);

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE);
  }, [dashboard?.city?.id]);

  function handleTripCreated(trip) {
    setTrips((prev) => [trip, ...prev]);
  }

  function removeTrip(tripId) {
    setTrips((prevTrips) => prevTrips.filter((trip) => trip.id !== tripId));

    // If deleted trip was active, clear selection
    if (activeTripId === tripId) {
      setActiveTripId(null);
    }
  }

  function bookmarkAttraction(tripId, attraction) {
    setTrips((prevTrips) =>
      prevTrips.map((trip) => {
        if (trip.id !== tripId) return trip;

        const alreadyBookmarked = trip.bookmarks?.some(
          (b) => b.attractionId === attraction.id
        );

        if (alreadyBookmarked) return trip;

        return {
          ...trip,
          bookmarks: [
            ...(trip.bookmarks || []),
            {
              attractionId: attraction.id,
              name: attraction.name,
              category: attraction.category,
              lat: attraction.lat,
              lon: attraction.lon,
            },
          ],
        };
      })
    );
  }

  function removeBookmark(tripId, attractionId) {
    setTrips((prevTrips) =>
      prevTrips.map((trip) => {
        if (trip.id !== tripId) return trip;

        return {
          ...trip,
          bookmarks: (trip.bookmarks || []).filter(
            (b) => b.attractionId !== attractionId
          ),
        };
      })
    );
  }

  const filteredAttractions = dashboard
    ? dashboard.attractions
        .filter((a) => {
          const filter = ATTRACTION_FILTERS[selectedCategory];
          if (!filter) return true;

          return filter.match(a.category || "");
        })
        .sort((a, b) => {
          if (sortBy === "name") {
            return a.name.localeCompare(b.name);
          }

          if (sortBy === "distance") {
            const da =
              (a.lat - dashboard.city.lat) ** 2 +
              (a.lon - dashboard.city.lon) ** 2;
            const db =
              (b.lat - dashboard.city.lat) ** 2 +
              (b.lon - dashboard.city.lon) ** 2;
            return da - db;
          }

          return 0;
        })
    : [];
  const visibleAttractions = filteredAttractions.slice(0, visibleCount);

  async function loadCityDashboard(city) {
    if (!city?.id) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/cities/${city.id}/dashboard`);

      if (!res.ok) {
        throw new Error("Dashboard fetch failed");
      }

      const json = await res.json();
      setDashboard(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{ padding: "1.5rem", fontFamily: "sans-serif" }}
      className="dashboard"
    >
      <h1>Travel & Weather Dashboard</h1>

      <SearchBar onCitySelect={loadCityDashboard} />

      {loading && <p>Loading dashboard...</p>}

      {dashboard && (
        <>
          <CityHeader city={dashboard.city} />

          <WeatherSection weather={dashboard.weather} />

          <div style={{ margin: "1rem 0", display: "flex", gap: "1rem" }}>
            <label>
              Filter:
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{ marginLeft: "0.5rem" }}
              >
                {Object.entries(ATTRACTION_FILTERS).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value.label}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Sort by:
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{ marginLeft: "0.5rem" }}
              >
                <option value="name">Name</option>
                <option value="distance">Distance</option>
              </select>
            </label>
          </div>

          <AttractionsMap
            city={dashboard.city}
            attractions={visibleAttractions}
            selectedAttraction={selectedAttraction}
          />

          <AttractionsSection
            attractions={visibleAttractions}
            onSelect={setSelectedAttraction}
            activeTripId={activeTripId}
            onBookmark={(attraction) =>
              bookmarkAttraction(activeTripId, attraction)
            }
          />
          {filteredAttractions.length > visibleCount && (
            <button
              onClick={() => setVisibleCount((prev) => prev + INITIAL_VISIBLE)}
              style={{ marginTop: "1rem" }}
            >
              Show more
            </button>
          )}
          {visibleCount > INITIAL_VISIBLE && (
            <button
              onClick={() => setVisibleCount(INITIAL_VISIBLE)}
              style={{ marginTop: "1rem" }}
            >
              Show less
            </button>
          )}

          <TripsSection
            trips={trips}
            activeTripId={activeTripId}
            onSelectTrip={setActiveTripId}
            expandedTripId={expandedTripId}
            onSelectExpandedTrip={setExpandedTripId}
            onRemoveTrip={removeTrip}
            onRemoveBookmark={removeBookmark}
          />

          <CreateTripForm
            city={dashboard.city}
            onTripCreated={handleTripCreated}
          />
        </>
      )}
    </div>
  );
}
