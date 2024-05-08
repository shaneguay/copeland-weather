/**
 * Just using a simple builder pattern here to build the Open Weather API request URLs as for the most part they seem to
 * be identical except for the main search parameter (city, zip, and gps)
 */
export class OpenWeatherRequestBuilder {
    private baseUrl: string;
    private apiKey: string;
    private searchParam: string;
    private units: string = 'metric';
    private lang: string = 'en';

    constructor(baseUrl: string, apiKey: string) {
        this.baseUrl = `${baseUrl}?appid=${apiKey}`;;
    }

    withCity(city: string): OpenWeatherRequestBuilder {
        this.searchParam = `&q=${city.trim()}`;
        return this;
    }

    withZip(zipcode: string): OpenWeatherRequestBuilder {
        this.searchParam = `&zip=${zipcode.trim()}`;
        return this;
    }

    withGPS(lat: string, lon: string): OpenWeatherRequestBuilder {
        this.searchParam = `&lat=${lat.trim()}&lon=${lon.trim()}`;
        return this;
    }

    withUnits(units: string): OpenWeatherRequestBuilder {
        this.units = units;
        return this;
    }

    withLang(lang: string): OpenWeatherRequestBuilder {
        this.lang = lang;
        return this;
    }

    build(): string {
        return `${this.baseUrl}${this.searchParam}&units=${this.units}&lang=${this.lang}`;
    }
}