import { DateTime } from 'luxon';

export default () => (req, res, next) => {
	res.error = (error) => {
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

		res.json({
			message: error.message,
			status_code: res.statusCode,
			path: `${req.method}:${req.originalUrl}`
		});
	};
	next();
};
