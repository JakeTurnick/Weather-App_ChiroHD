// ForecastCard.tsx
import React, { FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition, IconProp } from '@fortawesome/fontawesome-svg-core';
import { faSun, faCloudSun, faCloudRain, faBolt, faCloud, faCloudShowersHeavy, faSnowflake, faCloudMeatball, faIcicles, faSmog, faQuestion } from '@fortawesome/free-solid-svg-icons';
import { ForecastCardProps, DegreeUnitValue, ForecastWind } from '../types';
import './forecastCard.css';

/**
 * Helper function to format the DegreeUnitValue to a string (e.g., "25°C").
 */
const formatTemperature = (temp: DegreeUnitValue): string => {
  const symbol = temp.unit === 'CELSIUS' ? '°C' : '°F';
  return `${Math.round(temp.degrees)}${symbol}`;
};

/**
 * Helper function to format the wind data.
 */
const formatWind = (wind: ForecastWind): string => {
  const speed = wind.speed.value ?? wind.speed.quantity;
  const unit = wind.speed.unit === 'KILOMETERS_PER_HOUR' ? 'kph' : 'mph';
  return `${wind.direction.cardinal} @ ${Math.round(speed ?? 0)} ${unit}`;
};

/**
 * Helper function to convert ISO time string to a local time (e.g., "8:00 AM").
 */
const formatTime = (isoTime: string): string => {
  return new Date(isoTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
};

/**
 * A card component that displays the forecast for a single day based on 
 * the Google Weather API ForecastDay structure.
 */
export default function ForecastCard({ forecast }: ForecastCardProps) {
  const { 
    displayDate,
    maxTemperature,
    minTemperature,
    daytimeForecast,
    sunEvents,
    feelsLikeMaxTemperature,
  } = forecast;

  const { weatherCondition, precipitation, uvIndex } = daytimeForecast;

  // Format the date for display (e.g., "THU, 19 NOV")
  const dateObj = new Date(displayDate.year, displayDate.month - 1, displayDate.day);
  const formattedDate = dateObj.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  }).toUpperCase();

  const iconClassName = mapWeatherToFaIcon(daytimeForecast.weatherCondition.description.text);

  return (
    <div className="forecast-card">
      
      {/* Date and High/Low */}
      <h3 className="forecast-card-date">
        {formattedDate}
      </h3>

      <div className="forecast-card-temps">
        <span className="temp-max">
          {formatTemperature(maxTemperature)}
        </span>
        <span className="temp-min">
          / {formatTemperature(minTemperature)}
        </span>
      </div>
      
      {/* Icon and Description */}
      <div className="forecast-card-condition">
        {/* Note: The iconBaseUri is not a complete URL, so we use a placeholder */}
        

        <div className="forecast-card-condition-icon">
            <FontAwesomeIcon icon={iconClassName} size="2x" />
        </div>

        <p className="condition-text">
          {weatherCondition.description.text}
        </p>
      </div>

      {/* Details Grid */}
      <div className="forecast-card-details-grid">
        <p>
          🌡️ Feels Like Max: {formatTemperature(feelsLikeMaxTemperature)}
        </p>
        <p>
          💧 Chance of Rain: {precipitation.probability.percent}%
        </p>
        <p>
          ☀️ UV Index: {uvIndex}
        </p>
        <p>
          💨 Wind: {formatWind(daytimeForecast.wind)}
        </p>
        <p>
          🌅 Sunrise: {formatTime(sunEvents.sunriseTime)}
        </p>
        <p>
          🌃 Sunset: {formatTime(sunEvents.sunsetTime)}
        </p>
      </div>
    </div>
  );
};


const mapWeatherToFaIcon = (descriptionText: string): IconDefinition => {
  // Normalize the text to uppercase for robust matching, 
  // and trim any surrounding whitespace.
  const normalizedText = descriptionText.toUpperCase().trim();

  switch (normalizedText) {
    // --- Clear/Sunny ---
    case 'CLEAR':
    case 'SUNNY':
    case 'MOSTLY SUNNY':
      return faSun; // ☀️

    // --- Cloudy/Overcast ---
    case 'PARTLY CLOUDY':
    case 'MOSTLY CLOUDY':
      return faCloudSun; // 🌤️

    case 'CLOUDY':
    case 'OVERCAST':
      return faCloud; // ☁️

    // --- Rain ---
    case 'LIGHT RAIN':
    case 'SCATTERED SHOWERS':
    case 'PATCHY RAIN NEARBY':
      return faCloudRain; // 🌧️

    case 'MODERATE RAIN':
    case 'HEAVY RAIN':
    case 'RAIN':
      return faCloudShowersHeavy; // 💦

    // --- Thunderstorms ---
    case 'THUNDERSTORM':
    case 'POSSIBLE THUNDERSTORMS':
    case 'SEVERE THUNDERSTORMS':
      return faBolt; // ⛈️

    // --- Snow/Sleet/Ice ---
    case 'SNOW':
    case 'HEAVY SNOW':
    case 'SNOW SHOWERS':
    case 'BLIZZARD':
      return faSnowflake; // ❄️

    case 'SLEET':
    case 'MIXED RAIN AND SNOW':
      return faCloudMeatball; // 🌨️ (If using Pro) or fa-cloud-meatball (as a decent substitute)

    case 'FREEZING RAIN':
    case 'ICE PELLETS':
      return faIcicles; // 🧊

    // --- Fog/Haze ---
    case 'FOG':
    case 'MIST':
    case 'HAZE':
      return faSmog // 🌫️

    // --- Default/Unknown ---
    default:
      // A safe default icon for any unhandled or unknown weather condition
      return faQuestion; // ❓
  }
};