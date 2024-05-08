/**
 * Standard Weather entity class to hold weather data
 * Assumes that eventually this can be used to persist to a database
 */
export class Weather {
    city: string | null;
    country: string | null;
    lon: number;
    lat: number;
    main: string;
    description: string;
    temp: number;
    tempSuffix: string;
    pressure: number;
    humidity: number;
    wind: number;
    sunrise: string | null;
    sunset: string | null;
    timestamp: string | null;
}