import styles from './WeatherSnapshot.module.css';

type WeatherDataProps = {
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
};

const WeatherSnapshot = ({ weatherData }: { weatherData: WeatherDataProps }) => {
    const {
        city,
        country,
        description,
        temp,
        tempSuffix,
        pressure,
        humidity,
        wind,
        sunrise,
        sunset,
        timestamp
    } = weatherData;

    return (
        <div className={styles.card}>
            <div className={styles.title}>{city}, {country} - {description}</div>
            <div className={styles.timestamp}>Readings as of {timestamp}</div>
            <div className={styles.weatherInfo}>
                <div className={styles.details}>
                    <div>Temperature: {temp} {tempSuffix}</div>
                    <div>Pressure: {pressure} hPa</div>
                    <div>Humidity: {humidity}%</div>
                    <div>Wind Speed: {wind} m/s</div>
                    <div>Sunrise: {sunrise}</div>
                    <div>Sunset: {sunset}</div>
                </div>
            </div>
        </div>
    );
}

export default WeatherSnapshot;