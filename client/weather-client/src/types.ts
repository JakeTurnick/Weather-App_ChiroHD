// --- PLACES API ---

/** contains latitude and longitude. */
export interface Location {
  lat: number;
  lng: number;
}

/** geometry object containing the location. */
export interface Geometry {
  location: Location;

}

/** single Geocode result object. */
export interface Geocode {
  formatted_address: string;
  geometry: Geometry;
  place_id: string;
}

/** full response structure you receive from the server. */
export interface GeocodeResponse {
  timestamp: string; 
  geocode: {
    results: Geocode[];
    status: string;
  };
}

export interface GPlace {
  description: string,
  place_id: string;
}

// --- WEATHER API ---

/**
 * Interface for the detailed description of the weather condition.
 */
export interface WeatherDescription {
  text: string;
  languageCode: string;
}

/**
 * Interface for the weather condition block (icon, description, type).
 */
export interface WeatherCondition {
  iconBaseUri: string;
  description: WeatherDescription;
  type: string; // e.g., 'PARTLY_CLOUDY', 'RAIN', 'CLEAR'
}

/**
 * Interface for temperature values.
 */
export interface DegreeUnitValue {
  degrees: number;
  unit: 'CELSIUS' | 'FAHRENHEIT';
}

/**
 * Interface for generic quantity/value with a unit.
 * Used for QPF, Wind Speed/Gust, and Ice Thickness.
 */
export interface QuantityUnitValue {
  quantity?: number; // Used for QPF
  value?: number; // Used for Wind Speed/Gust
  thickness?: number; // Used for Ice Thickness
  unit: string; // e.g., 'MILLIMETERS', 'KILOMETERS_PER_HOUR'
}

/**
 * Interface for time zone information.
 */
export interface TimeZone {
    id: string; // e.g., "America/Los_Angeles"
}

// --- Forecast-Specific Interfaces ---

/**
 * Interface for the start and end time of a period.
 */
export interface TimeInterval {
  startTime: string; // ISO 8601 e.g., "2025-02-10T15:00:00Z"
  endTime: string; // ISO 8601 e.g., "2025-02-11T15:00:00Z"
}

/**
 * Interface for the human-readable date components.
 */
export interface DisplayDate {
  year: number;
  month: number;
  day: number;
}

/**
 * Interface for the wind direction, including cardinal direction.
 */
export interface WindDirectionForecast {
  degrees: number;
  cardinal: string; // e.g., 'WEST', 'SOUTH_SOUTHWEST'
}

/**
 * Interface for the wind block in the forecast.
 */
export interface ForecastWind {
  direction: WindDirectionForecast;
  speed: QuantityUnitValue;
  gust: QuantityUnitValue;
}

/**
 * Interface for precipitation probability.
 */
export interface PrecipitationProbability {
  percent: number;
  type: string; // e.g., 'RAIN', 'SNOW', 'RAIN_AND_SNOW'
}

/**
 * Interface for precipitation data (probability and QPF).
 */
export interface Precipitation {
  probability: PrecipitationProbability;
  qpf: QuantityUnitValue;
}

/**
 * Interface for daytime or nighttime-specific forecast details.
 */
export interface DayOrNightForecast {
  interval: TimeInterval;
  weatherCondition: WeatherCondition;
  relativeHumidity: number; // percentage value
  uvIndex: number;
  precipitation: Precipitation;
  thunderstormProbability: number; // percentage value
  wind: ForecastWind;
  cloudCover: number; // percentage value
}

/**
 * Interface for sunrise and sunset times.
 */
export interface SunEvents {
  sunriseTime: string; // ISO 8601
  sunsetTime: string; // ISO 8601
}

/**
 * Interface for moon phase and rise/set times.
 */
export interface MoonEvents {
  moonPhase: string; // e.g., 'WAXING_GIBBOUS'
  moonriseTimes: string[]; // array of ISO 8601 strings
  moonsetTimes: string[]; // array of ISO 8601 strings
}

/**
 * Interface for a single day's worth of forecast data.
 */
export interface ForecastDay {
  interval: TimeInterval;
  displayDate: DisplayDate;
  daytimeForecast: DayOrNightForecast;
  nighttimeForecast: DayOrNightForecast;
  maxTemperature: DegreeUnitValue;
  minTemperature: DegreeUnitValue;
  feelsLikeMaxTemperature: DegreeUnitValue;
  feelsLikeMinTemperature: DegreeUnitValue;
  sunEvents: SunEvents;
  moonEvents: MoonEvents;
  maxHeatIndex: DegreeUnitValue;
  iceThickness: QuantityUnitValue;
}

/**
 * The main interface representing the complete JSON response 
 * from the Forecast Days endpoint.
 */
export interface ForecastDaysResponse {
  forecastDays: ForecastDay[];
  timeZone: TimeZone;
  nextPageToken: string;
}

export interface ForecastCardProps {
  forecast: ForecastDay;
}