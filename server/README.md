# Features

## Server Features

- Provides 3 API endpoints for weather data retrieval based on city, zip code, and GPS.
- Performs criteria validation for proper search term usage.
- Implements caching for faster response and reduced external API calls (set to 15s TTL for testing).
- Option to automatically load the React client files from `/client/dist/` when navigating to the root URL (`/`).


## API Server Setup

1. Navigate to the `/server` folder.
2. Run `npm install`.
3. Create a `.env` file within the `/server` folder with the following keys:

```plaintext
OPENWEATHER_API_URL=https://api.openweathermap.org/data/2.5/weather
OPENWEATHER_API_KEY=<your_openweather_api_key>
```

### Running the API Server

1. Start the API server by running `npm run start:dev`.


# Testing

- Run unit tests for API server service classes using Jest with `npm run test:watch` from the `/server` directory.
- Perform end-to-end endpoint testing manually from Visual Studio Code using the `endpoint-tests.http` file in `/server/test/`. (Requires REST Client for Visual Studio Code extension.)
