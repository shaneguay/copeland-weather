import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom } from 'rxjs';
import { convertUtcSecondsToLocal } from '../utilities/timezoneUtils';
import { Weather } from './entities/weather.entity';
import { OpenWeatherRequestBuilder } from '../utilities/openweather-requestbuilder';


@Injectable()
export class WeatherService {
    openWeatherApiUrl: string;
    openWeatherApiKey: string;

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService
    ) {
        /**
         * NOTE FOR REVIEWERS of this project:
         * Make sure to create a .env file in the root of this /server folder with the following content:
         * OPENWEATHER_API_URL=https://api.openweathermap.org/data/2.5/weather
         * OPENWEATHER_API_KEY=<api_key>
         */
        this.openWeatherApiUrl = this.configService.get<string>('OPENWEATHER_API_URL');
        this.openWeatherApiKey = this.configService.get<string>('OPENWEATHER_API_KEY');
    }

    /**
     * Retrieves weather data from OpenWeather API by city name - purposely only looks for city name data to keep it
     * separation of concern and not mix with other location retrieval data
     * !! Does violate the DRY principle, but for the sake of this project i'm just keeping it separate 
     * @param city City name to search weather for (can be include comma separated country code for more accurate results)
     * @param units Units of temperature to return (metric, imperial, standard) (default is metric)
     * @param lang The language to return the textual weather data in (default is English)
     * @returns Weather entity object with the weather data
     */
    async getWeatherByCity(city: string, units: string = 'metric', lang: string = 'en') {
        // I repeating validation in the service layers (duplicate of my controller validation) as this service
        // can possibly be called from other services (same applies to the other methods below)
        if (/^[a-zA-Z\s,'-]+$/.test(city) === false)
            throw new NotFoundException('Invalid city format. Please enter a valid city.');

        const openWeatherUrl = new OpenWeatherRequestBuilder(this.openWeatherApiUrl, this.openWeatherApiKey)
            .withCity(city).withUnits(units).withLang(lang).build();

        const { data } = await firstValueFrom(
            this.httpService.get(openWeatherUrl).pipe(
                catchError((error) => {
                    throw new NotFoundException(error.response?.data?.message);
                })
            ),
        );

        return this.mapWeatherData(data, units);
    }

    /**
     * Retrieves weather data from OpenWeather API by city name - purposely only looks for zip code data to keep it
     * separation of concern and not mix with other location retrieval data
     * !! Does violate the DRY principle, but for the sake of this project i'm just keeping it separate 
     * @param city City name to search weather for (can be include comma separated country code for more accurate results)
     * @param units Units of temperature to return (metric, imperial, standard) (default is metric)
     * @param lang The language to return the textual weather data in (default is English)
     * @returns Weather entity object with the weather data
     */
    async getWeatherByZipcode(zipcode: string, units: string = 'metric', lang: string = 'en') {
        // Validate zipcode format
        if (/^\d+$/.test(zipcode.trim()) === false)
            throw new NotFoundException('Invalid zipcode format. Please enter a valid zipcode.');

        const openWeatherUrl = new OpenWeatherRequestBuilder(this.openWeatherApiUrl, this.openWeatherApiKey)
            .withZip(zipcode).withUnits(units).withLang(lang).build();

        const { data } = await firstValueFrom(
            this.httpService.get(openWeatherUrl).pipe(
                catchError((error) => {
                    throw new NotFoundException(error.response?.data?.message);
                })
            ),
        );

        return this.mapWeatherData(data, units);
    }

    /**
     * Retrieves weather data from OpenWeather API by city name - purposely only looks for gps data to keep it
     * separation of concern and not mix with other location retrieval data
     * !! Does violate the DRY principle, but for the sake of this project i'm just keeping it separate 
     * @param city City name to search weather for (can be include comma separated country code for more accurate results)
     * @param units Units of temperature to return (metric, imperial, standard) (default is metric)
     * @param lang The language to return the textual weather data in (default is English)
     * @returns Weather entity object with the weather data
     */
    async getWeatherByGPS(gps: string, units: string = 'metric', lang: string = 'en') {
        // Validate GPS coordinates format
        if (/^-?\d{1,2}\.\d{1,6},\s*-?\d{1,3}\.\d{1,6}$/.test(gps) === false)
            throw new NotFoundException('Invalid GPS coordinates format.');

        const [lat, lon] = gps.split(',');

        const openWeatherUrl = new OpenWeatherRequestBuilder(this.openWeatherApiUrl, this.openWeatherApiKey)
            .withGPS(lat, lon).withUnits(units).withLang(lang).build();

        const { data } = await firstValueFrom(
            this.httpService.get(openWeatherUrl).pipe(
                catchError((error) => {
                    throw new NotFoundException(error.response?.data?.message);
                })
            ),
        );

        return this.mapWeatherData(data, units);
    }


    /**
     * Mapping function to condense and abbreviate the weather JSON data, for better usability and only return 
     * the data we are interested in
     * @param data JSON data from OpenWeather API
     * @returns Condensed and abbreviated weather data
     */
    mapWeatherData(data: any, units: string): Weather {
        const timezoneOffset = data?.timezone || 0;
        const { coord, weather, main, wind, sys, name, dt } = data;

        const weatherEntity = new Weather();

        weatherEntity.city = name || `(${coord?.lat}, ${coord?.lon})`;
        weatherEntity.country = sys?.country;
        weatherEntity.lon = coord?.lon;
        weatherEntity.lat = coord?.lat;
        weatherEntity.main = weather?.[0]?.main;
        weatherEntity.description = weather?.[0]?.description.replace(/\b\w/g, l => l.toUpperCase());
        weatherEntity.temp = main?.temp;
        weatherEntity.pressure = main?.pressure;
        weatherEntity.humidity = main?.humidity;
        weatherEntity.wind = wind?.speed;
        weatherEntity.sunrise = sys?.sunrise ? convertUtcSecondsToLocal(sys.sunrise, timezoneOffset) : null;
        weatherEntity.sunset = sys?.sunset ? convertUtcSecondsToLocal(sys.sunset, timezoneOffset) : null;
        weatherEntity.timestamp = dt ? convertUtcSecondsToLocal(dt, timezoneOffset) : null;

        switch (units) {
            case 'imperial': weatherEntity.tempSuffix = '°F'; break;
            case 'metric': weatherEntity.tempSuffix = '°C'; break;
            default: weatherEntity.tempSuffix = 'K'; break;
        }

        return weatherEntity;
    }
}
