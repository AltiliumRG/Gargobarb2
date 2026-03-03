import { useEffect, useRef, useState } from "react";
import { GoogleMap, Marker, Autocomplete, useLoadScript } from "@react-google-maps/api";

const libraries = ["places"];

export default function LocationPickerGoogle({ data, updateData }) {

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries
  });

  const autocompleteRef = useRef(null);

  const [center, setCenter] = useState({
    lat: 6.2442,
    lng: -75.5812
  });

  const [inputValue, setInputValue] = useState(data.address || "");

  /* ============================================================
     📍 CENTRAR MAPA CUANDO CAMBIA CIUDAD
  ============================================================ */
  useEffect(() => {
  if (!isLoaded) return;

  // 1️⃣ Si ya existe ubicación guardada → usarla
  if (data.latitude && data.longitude) {
    setCenter({
      lat: Number(data.latitude),
      lng: Number(data.longitude)
    });
    return;
  }

  // 2️⃣ Si no hay coordenadas pero sí ciudad → geocode
  if (data.city) {
    const geocoder = new window.google.maps.Geocoder();

    geocoder.geocode(
      { address: `${data.city}, ${data.department}, Colombia` },
      (results, status) => {
        if (status === "OK" && results[0]) {
          const loc = results[0].geometry.location;
          setCenter({
            lat: loc.lat(),
            lng: loc.lng()
          });
        }
      }
    );
  }

}, [data.city, data.latitude, data.longitude, isLoaded]);

  /* ============================================================
     📍 SI CAMBIAN COORDENADAS DESDE WIZARD → MOVER MAPA
  ============================================================ */
  useEffect(() => {
    if (data.latitude && data.longitude) {
      setCenter({
        lat: Number(data.latitude),
        lng: Number(data.longitude)
      });
    }
  }, [data.latitude, data.longitude]);

  /* ============================================================
     📍 AUTOCOMPLETE SELECCIÓN
  ============================================================ */
  const onPlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();

    if (!place.geometry) return;

    const location = place.geometry.location;

    const lat = location.lat();
    const lng = location.lng();

    setInputValue(place.formatted_address);

    updateData({
      address: place.formatted_address,
      formatted_address: place.formatted_address,
      latitude: lat,
      longitude: lng,
      place_id: place.place_id
    });

    setCenter({
      lat,
      lng
    });
  };

  if (!isLoaded) return <p className="text-gray-400">Cargando mapa...</p>;

  return (
    <div className="space-y-4">

      {/* ======================================================
          🔎 INPUT CONTROLADO
      ====================================================== */}
      <Autocomplete
        onLoad={(ref) => (autocompleteRef.current = ref)}
        onPlaceChanged={onPlaceChanged}
        options={{
          componentRestrictions: { country: "co" },
          fields: ["geometry", "formatted_address", "place_id"]
        }}
      >
        <input
          type="text"
          placeholder="Buscar dirección..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="w-full p-4 rounded-xl bg-black/40 border border-white/10 text-white"
        />
      </Autocomplete>

      {/* ======================================================
          🗺️ MAPA
      ====================================================== */}
      <GoogleMap
        center={center}
        zoom={16}
        mapContainerStyle={{ width: "100%", height: "300px" }}
      >

        {data.latitude && data.longitude && (
          <Marker
            key={`${data.latitude}-${data.longitude}`}
            position={{
              lat: Number(data.latitude),
              lng: Number(data.longitude),
            }}
            draggable
            onDragEnd={(e) => {
              const lat = e.latLng.lat();
              const lng = e.latLng.lng();

              updateData({
                latitude: lat,
                longitude: lng
              });

              setCenter({
                lat,
                lng
              });
            }}
          />
        )}

      </GoogleMap>

    </div>
  );
}