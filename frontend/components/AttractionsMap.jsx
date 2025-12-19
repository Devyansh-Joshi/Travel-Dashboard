import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect, useRef } from "react";

function FlyToCity({ city }) {
  const map = useMap();

  useEffect(() => {
    if (city) {
      map.flyTo([city.lat, city.lon], 12, {
        duration: 0.8,
      });
    }
  }, [city, map]);

  return null;
}

function FlyToAttraction({ attraction }) {
  const map = useMap();

  useEffect(() => {
    if (attraction) {
      map.flyTo([attraction.lat, attraction.lon], 14, {
        duration: 0.8,
      });
    }
  }, [attraction, map]);

  return null;
}

export default function AttractionsMap({
  city,
  attractions,
  selectedAttraction,
}) {
  const markerRefs = useRef({});

  useEffect(() => {
    if (selectedAttraction) {
      const marker = markerRefs.current[selectedAttraction.id];
      if (marker) {
        marker.openPopup();
      }
    }
  }, [selectedAttraction]);

  if (!city) return null;

  return (
    <div style={{ height: "400px", marginTop: "1rem" }}>
      <MapContainer
        center={[city.lat, city.lon]}
        zoom={12}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FlyToAttraction attraction={selectedAttraction} />
        <FlyToCity city={city} />

        {attractions.map((a) => (
          <Marker
            key={a.id}
            position={[a.lat, a.lon]}
            ref={(ref) => (markerRefs.current[a.id] = ref)}
          >
            <Popup>
              <strong>{a.name}</strong>
              <br />
              {a.category?.split(",")[0]}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
