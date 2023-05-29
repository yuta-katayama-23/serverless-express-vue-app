import { strict as assert } from 'assert';

import openapiValidator from '../../lib/custome-openapi-validator.js';
import user from './v1/user.js';

const BASE_V1_API_PATH = `/api/v1/user`;

export default (options = {}) => {
	assert.ok(options.app, 'app must be required');
	const { app } = options;

	app.use(
		openapiValidator({
			basePath: BASE_V1_API_PATH,
			apiSpec: 'srv/openapi/user.v1.yaml'
		})
	);
	app.use(`${BASE_V1_API_PATH}`, user);

	// eslint-disable-next-line no-unused-vars
	app.use((err, req, res, next) => {
		res.status(err.status || 500).error(err);
	});
};
