export default function AttractionsSection({
  attractions,
  onSelect,
  activeTripId,
  onBookmark,
}) {
  function copyCoords(lat, lon) {
    navigator.clipboard.writeText(`${lat}, ${lon}`);
  }

  return (
    <section>
      <h3>Attractions</h3>

      {attractions.length === 0 && <p>No attractions found.</p>}

      <div
        style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}
        className="card attraction-grid"
      >
        {attractions.map((a) => {
          const props = a.data?.properties || {};

          const Name =
            props.name_international?.en ||
            props.name_en ||
            props["name:en"] ||
            a.name;

          const displayName = Name.charAt(0).toUpperCase() + Name.slice(1);

          return (
            <div
              key={a.id}
              onClick={() => onSelect(a)}
              style={{
                border: "1px solid #ccc",
                borderRadius: 8,
                padding: "0.75rem",
                width: 260,
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                gap: "0.4rem",
              }}
            >
              {/* Name */}
              <strong>{displayName}</strong>

              {/* Address */}
              {props.formatted && (
                <p style={{ fontSize: "0.8rem", color: "gray" }}>
                  {props.formatted}
                </p>
              )}

              {/* Website */}
              {props.website && (
                <a
                  href={props.website}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  style={{ fontSize: "0.8rem" }}
                >
                  Official website
                </a>
              )}

              {/* Image link (if exists) */}
              {props.datasource.raw.image && (
                <a
                  href={props.datasource.raw.image}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  style={{ fontSize: "0.8rem" }}
                >
                  Attraction Images
                </a>
              )}

              {/* Actions */}
              <div
                style={{ display: "flex", gap: "0.5rem", marginTop: "auto" }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    copyCoords(a.lat, a.lon);
                  }}
                >
                  Copy coords
                </button>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onBookmark(a);
                }}
                disabled={!activeTripId}
              >
                ⭐ Bookmark
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
