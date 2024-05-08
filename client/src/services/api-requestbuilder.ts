/**
 * Just using a simple builder pattern here to build the Open Weather API request URLs as for the most part they seem to
 * be identical except for the main search parameter (city, zip, and gps)
 */
export class APIRequestBuilder {
    private baseUrl: string;
    private searchParam: string = '';
    private units: string = 'metric';
    private lang: string = 'en';

    constructor(baseUrl: string) {
        // Making sure the base URL ends with a slash
        this.baseUrl = baseUrl.charAt(baseUrl.length - 1) !== '/' ? baseUrl + '/' : baseUrl;
    }

    withCity(city: string): APIRequestBuilder {
        this.searchParam = `city/${city.trim()}`;
        return this;
    }

    withZip(zipcode: string): APIRequestBuilder {
        this.searchParam = `zipcode/${zipcode.trim()}`;
        return this;
    }

    withGPS(gps: string): APIRequestBuilder {
        this.searchParam = `gps/${gps.trim()}`;
        return this;
    }

    withUnits(units: string): APIRequestBuilder {
        this.units = units;
        return this;
    }

    withLang(lang: string): APIRequestBuilder {
        this.lang = lang;
        return this;
    }

    build(): string {
        return `${this.baseUrl}${this.searchParam}?units=${this.units}&lang=${this.lang}`;
    }
}