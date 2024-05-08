import { Test, TestingModule } from '@nestjs/testing';
import { WeatherService } from './weather.service';
import { HttpModule, HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { NotFoundException } from '@nestjs/common';

expect.extend({
	toBeEither(received, ...expectedValues) {
		const pass = expectedValues.some(value => value === received);
		if (pass) {
			return {
				message: () => `Expected ${received} not to be one of: ${expectedValues.join(', ')}`,
				pass: true,
			};
		} else {
			return {
				message: () => `Expected ${received} to be one of: ${expectedValues.join(', ')}`,
				pass: false,
			};
		}
	},
});

describe('WeatherService', () => {
	let service: WeatherService;
	let httpService: HttpService;
	let httpSpy: jest.SpyInstance;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [HttpModule],
			providers: [
				WeatherService,
				{
					provide: ConfigService,
					useValue: {
						get: jest.fn((key: string) => {
							if (key === 'OPENWEATHER_API_URL')
								return 'https://api.openweathermap.org/data/2.5/weather';
							else if (key === 'OPENWEATHER_API_KEY')
								return '9af9c82a52d636ab2e58acad9d5041ca';
						})
					}
				}
			],
		}).compile();

		service = module.get<WeatherService>(WeatherService);
		httpService = module.get<HttpService>(HttpService);
		httpSpy = jest.spyOn(httpService, 'get');
	});

	afterEach(() => {
		httpSpy.mockRestore();
	});


	/**
	 * City name checks
	 */
	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should return weather data by city name - Ottawa', async () => {
		const mockResponse: AxiosResponse = {
			data: { "name": "Ottawa" },
			status: 200,
			statusText: 'OK',
			headers: {},
			config: {
				headers: undefined
			}
		};
		const httpSpy = jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse));

		const weatherData = await service.getWeatherByCity('Ottawa');
		expect(weatherData.city).toBe('Ottawa');
	});

	it('should return consider Ott123wa an invalid city name', async () => {
		await expect(service.getWeatherByCity('Ott123wa')).rejects.toThrowError(NotFoundException);
	});

	it('should return weather data by city from OpenWeather API', async () => {
		const weatherData = await service.getWeatherByCity('Ottawa');
		expect(weatherData.city).toBe('Ottawa');
	});

	/**
	 * Zip code checks
	 */
	it('should return weather data by zip code - 90210', async () => {
		const mockResponse: AxiosResponse = {
			data: { "name": "Beverly Hills" },
			status: 200,
			statusText: 'OK',
			headers: {},
			config: {
				headers: undefined
			}
		};
		const httpSpy = jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse));

		const weatherData = await service.getWeatherByZipcode('90210');
		expect(weatherData.city).toBe('Beverly Hills');
	});

	it('should return consider Ott123wa an invalid zip code', async () => {
		await expect(service.getWeatherByCity('Ott123wa')).rejects.toThrowError(NotFoundException);
	});

	it('should return weather data by zip code from OpenWeather API', async () => {
		const weatherData = await service.getWeatherByZipcode('90210');
		expect(weatherData.city).toBe('Beverly Hills');
	});


	/**
	 * GPS checks
	 */
	it('should return weather data by GPS - 43.6532,-79.3832', async () => {
		const mockResponse: AxiosResponse = {
			data: { "name": "Downtown Toronto" },
			status: 200,
			statusText: 'OK',
			headers: {},
			config: {
				headers: undefined
			}
		};
		const httpSpy = jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse));

		const weatherData = await service.getWeatherByGPS('43.6532,-79.3832');
		expect(weatherData.city).toBe('Downtown Toronto');
	});

	it('should return consider Ott123wa an invalid GPS', async () => {
		await expect(service.getWeatherByGPS('Ott123wa')).rejects.toThrowError(NotFoundException);
	});

	it('should return weather data by GPS from OpenWeather API', async () => {
		const weatherData = await service.getWeatherByGPS('43.6532,-79.3832');
		expect(weatherData.city).toBe('Downtown Toronto');
	});

});
