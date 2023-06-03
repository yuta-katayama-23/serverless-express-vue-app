import { strict as assert } from 'assert';
import HttpError from './custom-http-error.js';

const retriveSession = (sid, store) => {
	assert.ok(sid, 'sid must be required');
	assert.ok(store, 'store must be required');

	return new Promise((resolve, reject) => {
		store.get(sid, (err, result) => {
			if (err) reject(err);
			resolve(result);
		});
	});
};

export default () => async (req, res, next) => {
	// https://github.com/expressjs/session/blob/v1.17.3/session/session.js#L72
	const { sessionStore: store } = req;

	try {
		const { authorization } = req.headers;
		if (!authorization)
			throw new HttpError(401, `authorization header missing`);
		const [type, sid] = authorization.split(/\s/, 2);
		if (type !== 'Bearer')
			throw new HttpError(400, `invalid token type: ${type}`);
		if (!sid) throw new HttpError(401, `token missing`);

		const session = await retriveSession(sid, store);
		if (!session || (!session.userId && req.originalUrl !== '/api/v1/signup'))
			throw new HttpError(401, `invalid session`);

		req.token = {
			userId: session.userId || null,
			email: session.email
		};
		next();
	} catch (e) {
		res.status(500).error(e);
	}
};
