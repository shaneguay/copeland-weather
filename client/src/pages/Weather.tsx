import { useState } from 'react';
import WeatherInputForm from '../components/WeatherInputForm'
import WeatherSnapshot from '../components/WeatherSnapshot'
import { fetchWeatherData } from '../services/weatherFetchService';

type weatherData = {
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

function Weather() {
    const [weatherData, setWeatherData] = useState<weatherData[]>([]);

    const fetchWeather = async (searchParam: string, units: string = 'metric', lang: string = 'en'): Promise<any> => {
        const data = await fetchWeatherData(searchParam, units, lang);

        if (data.status != 200) {
            alert('Invalid search location - ' + data.status);
            return;
        }

        // Limiting the weather history to only last 5 (current + 4 previous searches)
        setWeatherData(prev => [data.payload, ...prev.slice(0, 4)]);
    };

    return (
        <>
            <WeatherInputForm cb={fetchWeather} />
            {
                /* Display the latest weather search results */
                weatherData.length > 0 &&
                <>
                    <div>Current Weather</div>
                    <WeatherSnapshot weatherData={weatherData[0]} />
                </>
            }

            {
                /* Display the previous 4 weather search results*/
                weatherData.length > 1 &&
                <>
                    <div>Last {weatherData.length - 1} searches...</div>
                    {
                        weatherData.map((data: weatherData, i: number) => {
                            if (i > 0)
                                return <WeatherSnapshot key={i} weatherData={data} />;
                        })
                    }
                </>
            }

        </>
    );
}

export default Weather;
