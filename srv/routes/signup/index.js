import { strict as assert } from 'assert';

import openapiValidator from '../../lib/custome-openapi-validator.js';
import signup from './v1/signup.js';

const BASE_V1_API_PATH = `/api/v1/signup`;

export default (options = {}) => {
	assert.ok(options.app, 'app must be required');
	const { app } = options;

	app.use(
		openapiValidator({
			basePath: BASE_V1_API_PATH,
			apiSpec: 'srv/openapi/signup.v1.yaml'
		})
	);
	app.use(`${BASE_V1_API_PATH}`, signup);

	// eslint-disable-next-line no-unused-vars
	app.use((err, req, res, next) => {
		res.status(err.status || 500).error(err);
	});
};
