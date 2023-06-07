import 'dotenv/config.js';
import { defineConfig } from 'cypress';

export default defineConfig({
	pageLoadTimeout: 75000, // 70s
	defaultCommandTimeout: 65000, // 65s
	env: {
		IS_DOCKER: process.env.IS_DOCKER,
		GOOGLE_ACCOUNT_ID: process.env.GOOGLE_ACCOUNT_ID,
		GOOGLE_ACCOUNT_PASSWORD: process.env.GOOGLE_ACCOUNT_PASSWORD
	},
	// https://docs.cypress.io/guides/references/configuration#e2e
	e2e: {
		supportFile: 'cypress/support/e2e.js',
		experimentalModifyObstructiveThirdPartyCode: true,
		specPattern: 'cypress/e2e/**/*.{cy,spec}.{js,ts}'
		// setupNodeEvents(on, config) {
		// 	// implement node event listeners here
		// }
	}
});
