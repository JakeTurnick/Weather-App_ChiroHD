import './App.css';
import {useState, useEffect, JSXElementConstructor, ReactElement, ReactNode, ReactPortal} from 'react';
import * as types from './types'
import ForecastCard from './components/forecastCard';


function App() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<types.GPlace[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<types.GPlace>();
  const [forecastData, setForecastData] = useState<types.ForecastDay[]>([]);


  // debounce search - prevents over submission to api
  useEffect(() => {
    if (searchTerm === debouncedSearchTerm) return;
    
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000)

    return () => {
      clearTimeout(timer);
    }
  }, [searchTerm]);

  // get location autocomplete
  useEffect(() => {
    if (!debouncedSearchTerm) return;
    
    (async () => {
        const locations = await CallApiAsync("http://localhost:3001/api/location-autocomplete", "POST", { search: debouncedSearchTerm});
        //console.log("locations results: ", locations)
        setSearchResults(locations.location);
    })();
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (selectedLocation == null) return;
    (async () => {
      const geoCode = await CallApiAsync("http://localhost:3001/api/get-geocode", "POST", { location: selectedLocation.place_id});
      //console.log("Geocode: ", (geoCode as types.GeocodeResponse).geocode.results[0].geometry.location)
      const location = (geoCode as types.GeocodeResponse).geocode.results[0].geometry.location;

      const forecast = await CallApiAsync("http://localhost:3001/api/get-weather", "POST", { latitude: location.lat, longitude: location.lng});
      //console.log("forecast respones: ", forecast.forecast.forecastDays)
      setForecastData(forecast.forecast.forecastDays);

    })();
  }, [selectedLocation]);

  return (
    <div className="App">
      <header className="App-header">
        <p>Search a place, Select a destination, See the weather</p>
        <input 
          type="text" 
          placeholder="Location..." 
          id='searchBar' 
          value={searchTerm} 
          onChange={(e) => { setSearchTerm(e.target.value)}}
        />
        <ul id="location-suggestions">
          { searchResults.length > 0 &&
            searchResults.map((result: any, index: number) => {
              return (
                <li 
                  key={index}
                  onClick={() => {
                    setSearchTerm(result.description)
                    setSelectedLocation(result)
                  }}
                  style={{ 
                    padding: '10px', 
                    cursor: 'pointer', 
                    borderBottom: '1px solid #eee'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#000000af'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#00000000'}>
                  {result.description}
                </li>)
            })
          }
        </ul>
        <div id="forecast_display">
          { forecastData &&
            forecastData.map((data: types.ForecastDay, index: number) => {
              return <ForecastCard forecast={data} key={index}/>
            })
          }
        </div>

      </header>
    </div>
  );
};

async function CallApiAsync(url: string, method: string, params: Object) {

  try {
    const response = await fetch(url, {
      method: method.toUpperCase(),
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(params)
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.log("error calling API async: ", error);
  };
};

export default App;
