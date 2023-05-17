import express from 'express';

const router = express.Router();

router.get('/token', async (req, res) => {
	const { session } = req;
	const {
		errors: { HttpError }
	} = req.app.locals;

	try {
		if (!session || !session.email)
			throw new HttpError(404, 'Session does not exists.');
		return res.status(200).json({ token: session.id });
	} catch (e) {
		return res.status(500).error(e);
	}
});

router.get('/login', async (req, res) => {
	const {
		session,
		app: {
			locals: { authClient, nodeEnv }
		},
		query: { url }
	} = req;

	if (session.userId)
		res.redirect(nodeEnv !== 'development' ? `/${nodeEnv}/home` : '/home');

	const { authUrl, state, codeVerifier } = authClient.start();
	if (url && url.startsWith('/') && !url.startsWith('/auth/login'))
		session.redirectUrl = url;
	session.state = state;
	session.codeVerifier = codeVerifier;
	await new Promise((resolve, reject) => {
		session.save((err) => {
			if (err) reject(err);
			resolve('');
		});
	});

	return res.redirect(authUrl);
});

router.get('/callback', async (req, res) => {
	const { session } = req;
	const {
		errors: { HttpError },
		authClient,
		nodeEnv
	} = req.app.locals;

	try {
		if (session.state !== req.query.state)
			throw new HttpError(400, 'Invalid state.');

		const { email, name } = await authClient.callback({
			req,
			state: session.state,
			codeVerifier: session.codeVerifier
		});

		const regenerate = (oldSession) => {
			return new Promise((resolve, reject) => {
				oldSession.regenerate((err) => {
					if (err) throw reject(err);
					const { session: newSession } = req;
					newSession.email = email;
					newSession.name = name;
					resolve(newSession);
				});
			});
		};
		await regenerate(session);

		return res.redirect(
			`${
				session.redirectUrl || nodeEnv !== 'development'
					? `/${nodeEnv}/home`
					: '/home'
			}`
		);
	} catch (e) {
		return res.status(500).error(e);
	}
});

export default router;
