"use client";

import React, { useState, useEffect } from "react";
import { GoogleMap, Marker, useJsApiLoader, Autocomplete } from "@react-google-maps/api";
import CustomInput from "./CustomInput";
import { LocationPickerProps } from "@/src/types/admin";

const containerStyle = {
  width: "100%",
  height: "300px",
};

const defaultCenter = { lat: 28.6139, lng: 77.209 }; 

const LocationPicker: React.FC<LocationPickerProps> = ({ value, onChange, disabled }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "", 
    libraries: ["places"],
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [searchLocationText,setSearchLocationtext]=useState<string>('');
  const [marker, setMarker] = useState({ lat: value.latitude || defaultCenter.lat, lng: value.longitude || defaultCenter.lng });
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    setMarker({ lat: value.latitude || defaultCenter.lat, lng: value.longitude || defaultCenter.lng });
  }, [value]);

  const onLoadAutocomplete = (autoC: google.maps.places.Autocomplete) => {
    setAutocomplete(autoC);
  };

  const onPlaceChanged = () => {
    if (!autocomplete) return;
    const place = autocomplete.getPlace();
    if (!place.geometry || !place.geometry.location) return;

    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    setMarker({ lat, lng });
    onChange({
      location: { en: place.formatted_address || "", hi: place.formatted_address || "" },
      latitude: lat,
      longitude: lng,
    });
    map?.panTo({ lat, lng });
  };

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (disabled || !e.latLng) return;
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setMarker({ lat, lng });
    onChange({
      location: { en: `Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`, hi: `Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}` },
      latitude: lat,
      longitude: lng,
    });
  };

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <div className="flex flex-col gap-2">
      <Autocomplete onLoad={onLoadAutocomplete} onPlaceChanged={onPlaceChanged}>
        <CustomInput
        value={searchLocationText}
        onChange={(e: React.ChangeEvent<HTMLInputElement>)=>{setSearchLocationtext(e.target.value)}}
          type="text"
          placeholder="Search location..."
          className="  rounded w-full"
          disabled={disabled}
        />
      </Autocomplete>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={{ lat: marker.lat, lng: marker.lng }}
        zoom={13}
        onLoad={(map) => setMap(map)}
        onClick={handleMapClick}
      >
        <Marker position={{ lat: marker.lat, lng: marker.lng }} />
      </GoogleMap>

      <div className="flex gap-2 mt-2">
        <CustomInput
        onChange={()=>{}}
          type="text"
          value={value.latitude || ""}
          readOnly
          placeholder="Latitude"
          className="  rounded flex-1"
        />
        <CustomInput
        onChange={()=>{}}
          type="text"
          value={value.longitude || ""}
          readOnly
          placeholder="Longitude"
          className="  rounded flex-1"
        />
      </div>
    </div>
  );
};

export default LocationPicker;
