/** Defines the structure for the latitude and longitude. */
export interface Location {
  lat: number;
  lng: number;
}

/** Defines the geometry object containing the location. */
export interface Geometry {
  location: Location;
  // ... other properties like location_type, viewport, etc.
}

/** Defines the structure of a single Geocode result object. */
export interface Geocode {
  formatted_address: string;
  geometry: Geometry;
  place_id: string;
}

/** Defines the full response structure you receive from the server. */
export interface GeocodeResponse {
  timestamp: string; // The timestamp from your server
  geocode: {
    results: Geocode[];
    status: string;
    // ... other properties like error_message
  };
}