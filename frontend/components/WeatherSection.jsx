export default function WeatherSection({ weather }) {
  return (
    <section style={{ marginBottom: "2rem" }}>
      <h3>
        Weather Forecast{" "}
        <span style={{ fontSize: "0.8rem", color: "gray" }}>
          (source: {weather.source})
        </span>
      </h3>

      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {weather.days.map((d) => {
          const date = new Date(d.date).toDateString();
          const data = d.data;

          return (
            <div
              key={d.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: 6,
                padding: "0.75rem",
                minWidth: 150,
              }}
            >
              <strong>{date}</strong>
              <div>{data.weather[0].description}</div>
              <div>Temp: {data.main.temp}°C</div>
              <div>Feels: {data.main.feels_like}°C</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
