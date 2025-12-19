import { useState } from "react";

const API_BASE = "http://localhost:4000";

export default function SearchBar({ onCitySelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  async function handleChange(e) {
    const value = e.target.value;
    setQuery(value);

    if (value.length < 2) {
      setResults([]);
      setHighlightedIndex(-1);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE}/api/cities/search?q=${encodeURIComponent(value)}`
      );
      const data = await res.json();
      setResults(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleSelect(city) {
    setQuery(`${city.name}, ${city.country}`);
    setResults([]);
    onCitySelect(city);
  }

  return (
    <div style={{ position: "relative", width: 300 }}>
      <input
        value={query}
        onChange={handleChange}
        placeholder="Search city..."
        style={{ padding: "0.5rem", width: "100%" }}
        onKeyDown={(e) => {
          if (!results.length) return;

          if (e.key === "ArrowDown") {
            e.preventDefault();
            setHighlightedIndex((prev) =>
              prev < results.length - 1 ? prev + 1 : 0
            );
          }

          if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlightedIndex((prev) =>
              prev > 0 ? prev - 1 : results.length - 1
            );
          }

          if (e.key === "Enter") {
            e.preventDefault();
            if (highlightedIndex >= 0) {
              handleSelect(results[highlightedIndex]);
            }
          }
        }}
      />

      {loading && <div style={{ fontSize: "0.8rem" }}>Searching...</div>}

      {results.length > 0 && (
        <ul
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "#111",
            border: "1px solid #333",
            listStyle: "none",
            padding: 0,
            margin: 0,
            zIndex: 10,
          }}
        >
          {results.map((city, idx) => (
            <li
              key={idx}
              onClick={() => handleSelect(city)}
              onMouseEnter={() => setHighlightedIndex(idx)}
              style={{
                padding: "0.5rem",
                cursor: "pointer",
                background: idx === highlightedIndex ? "#333" : "transparent",
              }}
            >
              {city.name}, {city.country}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
