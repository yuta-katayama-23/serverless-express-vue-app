import { DateTime } from 'luxon';
import crypto from 'crypto';
import snakecaseKeys from 'snakecase-keys';

export default () => (req, res, next) => {
	res.error = (error, seed = null) => {
		console.error(
			JSON.stringify(
				{
					time: DateTime.now().toISO(),
					error: {
						message: error.message,
						stack: error.stack,
						status: error.status || null
					}
				},
				null
			)
		);

		if (error.status) res.status(error.status);
		if (!res.statusCode) res.status(500);
		// TODO 409エラー対応（Sequlizeなどのエラーに基づき）

		const code = crypto
			.createHash('md5')
			.update(
				[
					req.method.toUpperCase(),
					req.baseUrl,
					res.statusCode,
					seed || error.seed
				].join(':')
			)
			.digest('hex');

		const errorResBody = {
			statusCode: res.statusCode,
			code,
			path: `${req.method}:${req.originalUrl}`,
			message: error.message,
			errors: []
		};
		if (error.errors && Array.isArray(error.errors))
			error.errors.forEach((e) => {
				const messages = [];
				if (e.path) messages.push(e.path);
				messages.push(e.message);
				errorResBody.errors.push({ message: messages.join(' : ') });
			});
		if (!errorResBody.errors.length)
			errorResBody.errors.push({ message: error.message });

		res.json(snakecaseKeys(errorResBody));
	};
	next();
};
