# Features

## Client Features

- Allows users to find weather data based on city location, zip code, or GPS location.
- Provides a single text input box that determines the type of search (city, zip, or GPS).
- Users can select the unit of measure (Fahrenheit, metric, or standard).
- Displays the current weather and a list of the last 4 weather searches.

# Project Installation

This project consists of a React/Vite front-end web client and a NestJS-based backend API server. Below are the instructions for setting up and running both parts of the project.


## Client Setup

1. Navigate to the `/client` folder.
2. Run `npm install`.
3. Create a `.env` file within the `/client` folder with the following keys:

```plaintext
REACT_APP_API_URL=http://localhost:3000/api/weather/
```

### Running the Client

#### Option A - Production Build

- Generate a distribution build by running `npm run build`.
- The production files will be located in the `/client/dist/` directory.
- The server is configured to serve static files from the `/client/dist` folder.
- Navigate to the root URL in your browser (e.g., http://localhost:3000/) to access the React client.

#### Option B - Development Mode

- Run the client in development mode with `npm run dev`.
- The client will be hosted at the specified local URL and port (e.g., http://localhost:5173).
