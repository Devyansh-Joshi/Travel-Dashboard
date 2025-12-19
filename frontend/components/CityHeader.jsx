export default function CityHeader({ city }) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <h2>
        {city.name}, {city.country}
      </h2>
      <p>
        Latitude: {city.lat} | Longitude: {city.lon}
      </p>
    </div>
  );
}
