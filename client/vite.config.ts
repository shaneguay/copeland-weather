import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const envKeys = [
	"REACT_APP_API_URL"
];

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');
	const processEnv: { [key: string]: any } = {};

	envKeys.forEach(key => { processEnv[key] = env[key]; });

	return {
		define: {
			'process.env': processEnv
		},
		plugins: [react()]
	}
})
