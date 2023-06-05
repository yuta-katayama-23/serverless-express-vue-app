import appRoot from 'app-root-path';
import camelcaseKeys from 'camelcase-keys';
import * as OpenApiValidator from 'express-openapi-validator';
import snakecaseKeys from 'snakecase-keys';
import { strict as assert } from 'assert';

const reqCaseConverter = (basePath) => (req, res, next) => {
	if (req.originalUrl.startsWith(basePath)) {
		if (req.body) req.body = camelcaseKeys(req.body, { deep: true });
		if (req.query) req.query = camelcaseKeys(req.query);
	}
	next();
};
const resCaseConverter = (basePath) => (req, res, next) => {
	if (req.originalUrl.startsWith(basePath)) {
		const originFunc = res.json;
		res.json = (data) => originFunc.call(res, snakecaseKeys(data));
	}
	next();
};

export default (options = {}) => {
	assert.ok(options.basePath, 'options.basePath must be required');
	assert.ok(options.apiSpec, 'options.apiSpec must be required');
	const { basePath, apiSpec } = options;

	const middleware = OpenApiValidator.middleware({
		apiSpec: appRoot.resolve(apiSpec),
		validateRequests: true,
		validateResponses: true,
		ignorePaths: (p) => !p.startsWith(basePath),
		// https://github.com/cdimascio/express-openapi-validator/wiki/Documentation#%EF%B8%8F-refparsermode-optional
		$refParser: { mode: 'dereference' }
	});

	middleware.push(reqCaseConverter(basePath));
	middleware.push(resCaseConverter(basePath));

	return middleware;
};
