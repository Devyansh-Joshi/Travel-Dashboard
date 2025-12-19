import TransportPanel from "./TransportPanel";

function TripsSection({
  trips,
  activeTripId,
  onSelectTrip,
  expandedTripId,
  onSelectExpandedTrip,
  onRemoveTrip,
  onRemoveBookmark,
}) {
  return (
    <section className="trips-section">
      <h3>Your Trips</h3>

      {trips.length === 0 && <p>No trips created yet.</p>}

      {trips.map((trip) => {
        const isOpen = activeTripId === trip.id;
        const isExpanded = expandedTripId === trip.id;

        return (
          <div
            key={trip.id}
            className={`card trip-card ${isOpen ? "active" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              onSelectTrip(trip.id);
            }}
            disabled={isOpen}
            style={{
              border: isOpen ? "2px solid #4f46e5" : "1px solid #ccc",
              padding: "1rem",
              borderRadius: 8,
            }}
          >
            <h4 className="trip-meta">
              {trip.fromCityName}, {trip.fromCityCountry || "--"}
              {" → "}
              {trip.cityName}, {trip.cityCountry || "--"}
            </h4>

            {/* <button>{isOpen ? "Selected" : "Select Trip"}</button> */}
            <button
              type="button"
              onClick={() => {
                if (window.confirm("Delete this trip?")) {
                  onRemoveTrip(trip.id);
                }
              }}
              style={{
                color: "red",
                marginLeft: "0.5rem",
              }}
              className="danger"
            >
              🗑 Delete Trip
            </button>

            <p>
              {new Date(trip.startDate).toDateString()} →{" "}
              {new Date(trip.endDate).toDateString()}
            </p>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelectExpandedTrip(isExpanded ? null : trip.id);
              }}
            >
              {isExpanded ? "Hide transport" : "View transport"}
            </button>

            {isExpanded && <TransportPanel trip={trip} />}

            {/* Bookmarks preview */}
            {trip.bookmarks?.length > 0 && (
              <div style={{ marginTop: "0.5rem" }}>
                <strong>⭐ Bookmarked Attractions</strong>
                <ul>
                  {trip.bookmarks.map((b) => (
                    <li
                      key={b.attractionId}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span>{b.name}</span>

                      <button
                        type="button"
                        onClick={() =>
                          onRemoveBookmark(trip.id, b.attractionId)
                        }
                        style={{
                          marginLeft: "0.5rem",
                          color: "red",
                        }}
                        className="danger"
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
}

export default TripsSection;
