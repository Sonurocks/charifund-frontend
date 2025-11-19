"use client";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect, useState } from "react";
import CustomInput from "./CustomInput"; // import your CustomInput

const markerIcon = L.icon({
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface Props {
  value: {
    location: { en?: string; hi?: string };
    latitude: number | null;
    longitude: number | null;
  };
  onChange: (v: { location: any; latitude: number; longitude: number }) => void;
  disabled?: boolean;
}

export default function LocationPicker({ value, onChange, disabled }: Props) {
  const [position, setPosition] = useState<[number, number] | null>(
    value.latitude && value.longitude ? [value.latitude, value.longitude] : null
  );
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (value.latitude && value.longitude) {
      setPosition([value.latitude, value.longitude]);
    }
  }, [value.latitude, value.longitude]);

  // fetch suggestions
  const fetchSuggestions = async (query: string) => {
    if (!query) return setSuggestions([]);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5`
      );
      const data = await res.json();
      setSuggestions(data);
      setShowDropdown(true);
    } catch (err) {
      console.error(err);
    }
  };

  // debounce input
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSuggestions(searchText);
    }, 300); // 300ms debounce
    return () => clearTimeout(timer);
  }, [searchText]);

  const handleSelect = (item: any) => {
    const lat = parseFloat(item.lat);
    const lon = parseFloat(item.lon);
    setPosition([lat, lon]);
    onChange({
      location: { en: item.display_name, hi: item.display_name },
      latitude: lat,
      longitude: lon,
    });
    setSearchText(item.display_name);
    setShowDropdown(false);
  };

  const MapUpdater = () => {
    const map = useMap();
    useEffect(() => {
      if (position) {
        map.setView(position, 13);
      }
    }, [position, map]);
    return null;
  };

  return (
    <div className="w-full relative">
      {/* Search Input */}
      <div className="flex flex-col relative w-full z-50">
        {/* Dropdown */}
        {showDropdown && suggestions.length > 0 && (
          <ul className="absolute top-full left-0 z-50 bg-white border w-full mt-1 max-h-52 overflow-y-auto rounded shadow">
            {suggestions.map((item, idx) => (
              <li
                key={idx}
                className="p-2 cursor-pointer hover:bg-gray-100 text-sm"
                onMouseDown={() => handleSelect(item)} // <-- use onMouseDown instead of onClick
              >
                {item.display_name}
              </li>
            ))}
          </ul>
        )}

      </div>

      {/* Map */}
      <div className="w-full h-[300px] rounded-md overflow-hidden  relative z-40 mt-2">
        <MapContainer
          center={position || [28.6139, 77.209]}
          zoom={position ? 13 : 5}
          className="h-full w-full"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap contributors"
          />
          <MapUpdater />
          {position && <Marker position={position} icon={markerIcon} />}
        </MapContainer>
      </div>

      {/* Latitude / Longitude display */}
      <div className="flex gap-2 mt-2">
        <CustomInput
          value={position ? position[0] : ""}
          placeholder="Latitude"
          readOnly
          className="flex-1"
        />
        <CustomInput
          value={position ? position[1] : ""}
          placeholder="Longitude"
          readOnly
          className="flex-1"
        />
      </div>
    </div>
  );
}
