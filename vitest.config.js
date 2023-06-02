// import { fileURLToPath, URL } from 'node:url';
import { mergeConfig } from 'vite';
import { defineConfig, configDefaults } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
	viteConfig,
	defineConfig({
		test: {
			environment: 'node',
			include: ['__tests__/**/*.js'],
			exclude: [...configDefaults.exclude, 'e2e/*'],
			testTimeout: 60000,
			reporters: ['verbose'],
			mockReset: true
		}
	})
);
