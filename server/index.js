// --- Requires ---
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
  console.log("Nodejs running locally");
}
const axios = require('axios');

// --- Config ---
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;
const GoogleApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

// --- Middleware ---
app.use(cors({
    origin: 'http://localhost:3000'
}));
app.use(express.json());

// --- API Endpoints ---
app.post('/api/location-autocomplete', async (req, res) => {
  const location = await getPlaceAutocompleteHttp(req.body.param);

  res.json({
    timestamp: new Date().toISOString(),
    location
  });
});

app.post('/api/get-geocode', async (req, res) => {
  const geocode = await getGeocode(req.body.param);

  res.json({
    timestamp: new Date().toISOString(),
    geocode
  });
});

// --- Helper functions ---
async function getPlaceAutocompleteHttp(inputQuery) {
  const baseUrl = 'https://maps.googleapis.com/maps/api/place/autocomplete/json';
  
  try {
    const response = await axios.get(baseUrl, {
      params: {
        input: inputQuery,
        key: GoogleApiKey, 
        // Optional parameters
        types: 'geocode', 
        components: 'country:us',
      }
    });

    if (response.data.status === 'OK') {
      //console.log('Autocomplete Predictions:', response.data.predictions);
      return response.data.predictions;
    } else {
      console.error('API Status Error:', response.data.status);
      return [];
    }

  } catch (error) {
    console.error('Error calling Google Maps Autocomplete API:', error.message);
    return [];
  }
}

async function getGeocode(placeID) {
  const geoCodeURL = `https://maps.googleapis.com/maps/api/geocode/json?place_id=${placeID}&key=${GoogleApiKey}`;
  
  try {
    const response = await axios.get(geoCodeURL);
    const data = response.data

    if (response.data.status === 'OK' && data.results.length > 0) {
      console.log('GeoCode data: ', response.data);
      return response.data;
    } else {
      console.error('API Status Error:', response.data.status);
      return [];
    }

  } catch (error) {
    console.error('Error calling Google Maps Geocode API:', error.message);
    return [];
  }
}

// Start the server
app.listen(port, () => {
  console.log(`\n\n[SERVER] 🚀 Server listening at http://localhost:${port}\n`);
});