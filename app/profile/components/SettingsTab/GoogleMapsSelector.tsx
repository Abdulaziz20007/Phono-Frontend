import { useState, useRef, useEffect } from "react";
import styled from "styled-components";

interface GoogleMapsSelectorProps {
  onLocationSelect: (lat: string, lng: string) => void;
  initialLat?: string;
  initialLng?: string;
}

const MapContainer = styled.div`
  width: 100%;
  height: 300px;
  margin: 15px 0;
  border-radius: 4px;
  overflow: hidden;
`;

const CoordinatesDisplay = styled.div`
  margin-top: 8px;
  font-size: 0.9em;
  color: #666;
`;

export default function GoogleMapsSelector({
  onLocationSelect,
  initialLat = "41.299496", // default to tashkent coordinates
  initialLng = "69.240073",
}: GoogleMapsSelectorProps) {
  const [lat, setLat] = useState(initialLat);
  const [lng, setLng] = useState(initialLng);
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);

  // Initialize map once when component mounts
  useEffect(() => {
    // Skip if Google Maps API isn't loaded or mapRef isn't available
    if (!window.google?.maps || !mapRef.current) return;

    // Skip if map is already initialized
    if (googleMapRef.current) return;

    // Parse initial coordinates
    const initialPosition = {
      lat: parseFloat(initialLat),
      lng: parseFloat(initialLng),
    };

    // Initialize the map
    const mapInstance = new google.maps.Map(mapRef.current, {
      center: initialPosition,
      zoom: 13,
      zoomControl: true,
      scrollwheel: true,
      disableDoubleClickZoom: false,
      fullscreenControl: true,
      streetViewControl: false,
      clickableIcons: false,
      mapTypeControl: true,
    });

    // Save map instance to ref
    googleMapRef.current = mapInstance;

    // Create initial marker
    const markerInstance = new google.maps.Marker({
      position: initialPosition,
      map: mapInstance,
    });

    // Save marker instance to ref
    markerRef.current = markerInstance;

    // Add click listener to the map
    mapInstance.addListener(
      "click",
      (mapsMouseEvent: google.maps.MapMouseEvent) => {
        if (!mapsMouseEvent.latLng) return;

        // Get the latitude and longitude from the click event
        const latLng = mapsMouseEvent.latLng.toJSON();

        // Update state with new coordinates
        const newLat = latLng.lat.toString();
        const newLng = latLng.lng.toString();
        setLat(newLat);
        setLng(newLng);

        // Pass coordinates to parent component
        onLocationSelect(newLat, newLng);

        // Update marker position rather than creating a new one
        if (markerRef.current) {
          markerRef.current.setPosition(latLng);
        }
      }
    );

    // Cleanup function to prevent memory leaks
    return () => {
      if (googleMapRef.current && google.maps.event) {
        google.maps.event.clearInstanceListeners(googleMapRef.current);
      }
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
      googleMapRef.current = null;
      markerRef.current = null;
    };
  }, []); // Empty dependency array ensures this only runs once

  return (
    <>
      <MapContainer ref={mapRef} id="map" />
      <CoordinatesDisplay>
        координаты: {lat}, {lng}
      </CoordinatesDisplay>
    </>
  );
}
