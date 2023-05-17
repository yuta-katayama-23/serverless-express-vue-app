import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import eslint from 'vite-plugin-eslint';

// https://vitejs.dev/config/
const options = {
	plugins: [
		nodePolyfills({ protocolImports: true }),
		vue({ template: { transformAssetUrls } }),
		vuetify({
			autoImport: true,
			styles: { configFile: 'src/styles/settings.scss' }
		}),
		eslint()
	],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url))
		}
	},
	server: {
		host: '0.0.0.0',
		port: 8080,
		proxy: {
			'^/(api|auth)/': { target: 'http://localhost:3000', changeOrigin: false }
		}
	}
};
if (process.env.NODE_ENV !== 'development')
	options.base =
		process.env.NODE_ENV === 'localdev' ? '/localdev' : '/production';

export default defineConfig(options);
