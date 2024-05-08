import { BadRequestException, Controller, Get, Param, Query, UseInterceptors } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { CacheInterceptor } from '@nestjs/cache-manager';

/**
 * Weather Controller class to handle weather API requests from external clients
 * I seperated each route to better allow extensibility if later it was decided to only allow authorized users to access certain routes 
 * 
 * Uses in-memory caching to reduce the number of API calls to the OpenWeather API based on a 15 second TTL
 */
@Controller('api/weather')
@UseInterceptors(CacheInterceptor)
export class WeatherController {
    constructor(private readonly weatherService: WeatherService) { }

    @Get('/city/:city')
    async getWeatherByCity(@Param('city') city: string, @Query('units') units: string = 'metric', @Query('lang') lang: string = 'en') {
        // Validate city name format
        if (/^[a-zA-Z\s,'-]+$/.test(city) === false)
            throw new BadRequestException('Invalid city format. Please enter a valid city.');

        // For reviewers: I'm using NestJS build expections injector handling to properly handle 404, etc.
        return this.weatherService.getWeatherByCity(city, units, lang);
    }

    @Get('/zipcode/:zipcode')
    getWeatherByZipcode(@Param('zipcode') zipcode: string, @Query('units') units: string = 'metric', @Query('lang') lang: string = 'en') {
        // Validate zipcode format
        if (/^\d+$/.test(zipcode.trim()) === false)
            throw new BadRequestException('Invalid zipcode format. Please enter a valid zipcode.');

        return this.weatherService.getWeatherByZipcode(zipcode, units, lang);
    }

    @Get('/gps/:gps')
    getWeatherByGPS(@Param('gps') gps: string, @Query('units') units: string = 'metric', @Query('lang') lang: string = 'en') {
        // Validate GPS coordinates format
        if (/^-?\d{1,2}\.\d{1,6},\s*-?\d{1,3}\.\d{1,6}$/.test(gps) === false)
            throw new BadRequestException('Invalid GPS coordinates format.');

        return this.weatherService.getWeatherByGPS(gps, units, lang);
    }
}

