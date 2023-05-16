import { strict as assert } from 'assert';

import auth from './v1/auth.js';

const BASE_V1_API_PATH = `/auth`;

export default (options = {}) => {
	assert.ok(options.app, 'app must be required');
	const { app } = options;

	app.use(`${BASE_V1_API_PATH}`, auth);

	// eslint-disable-next-line no-unused-vars
	app.use((err, req, res, next) => {
		res.status(err.status || 500).error(err);
	});
};
