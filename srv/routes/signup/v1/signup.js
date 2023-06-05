import { strict as assert } from 'assert';
import express from 'express';
import { DateTime } from 'luxon';
import verifyAccess from '../../../lib/verify-access.js';

const router = express.Router();

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

const saveSession = (sid, store, session) => {
	assert.ok(sid, 'sid must be required');
	assert.ok(store, 'store must be required');
	assert.ok(session, 'session must be required');

	return new Promise((resolve, reject) => {
		store.set(sid, session, (err) => {
			if (err) reject(err);
			resolve();
		});
	});
};

router.post('/', verifyAccess(), async (req, res) => {
	// https://github.com/expressjs/session/blob/v1.17.3/session/session.js#L72
	const { sessionStore: store } = req;
	const {
		models,
		errors: { HttpError }
	} = req.app.locals;
	const data = req.body;

	try {
		const existsUser = await models.user.findOne({
			where: { email: req.token.email }
		});
		if (existsUser) throw new HttpError(409, `user already exists`);

		const { id } = await models.user.create({
			...data,
			email: req.token.email,
			lastLoginedAt: DateTime.local().toUnixInteger()
		});
		const user = await models.user.findByPk(id);

		const session = await retriveSession(req.token.sid, store);
		await saveSession(req.token.sid, store, { ...session, userId: user.id });

		res
			.status(201)
			.json(user.toJSON({ exclude: ['id', 'accountTypeId', 'genderId'] }));
	} catch (e) {
		res.status(500).error(e);
	}
});

export default router;
