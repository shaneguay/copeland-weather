import { APIRequestBuilder } from './api-requestbuilder.ts';

type WeatherPayload = {
    status: number;
    payload: any;
};

// As a QoL feature I'm allowing a single search param to be entered and I'll use Regex to 
// determine if it's a city name, zip code or GPS coordinates
// Using the following rules:
//      - City name: Only letters, spaces, commas, apostrophes and hyphens
//      - Zip code: Only numbers
//      - GPS: Latitude and Longitude separated by a comma

export async function fetchWeatherData(searchParam: string, units: string = 'metric', lang: string = 'en'): Promise<WeatherPayload> {
    // Normally I would never hardcode the fallback URL here but to make it easier for the reviewer so
    // you don't need a .env file for both client and server I'm doing it here.
    let apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000/api/weather/';

    let apiRequestBuilder = new APIRequestBuilder(apiUrl);

    searchParam = searchParam.trim();

    // Is city name (including region and/or country)
    if (/^[a-zA-Z\s,'-]+$/.test(searchParam)) {
        apiRequestBuilder.withCity(searchParam);
    }
    // Is zip code
    else if (/^\d+$/.test(searchParam)) {
        apiRequestBuilder.withZip(searchParam);
    }
    // Is GPS
    else if (/^-?\d{1,2}\.\d{1,6},\s*-?\d{1,3}\.\d{1,6}$/.test(searchParam)) {
        apiRequestBuilder.withGPS(searchParam);
    }
    else {
        console.error('Invalid search parameter');
        return { status: 404, payload: null };
    }

    let apiWeatherUrl: string = apiRequestBuilder.withUnits(units).withLang(lang).build();

    const res = await fetch(apiWeatherUrl);

    if (res.status !== 200)
        return { status: res.status, payload: null };

    const data = await res.json();
    return { status: res.status, payload: data };
}

