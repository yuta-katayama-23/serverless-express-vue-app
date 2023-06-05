import express from 'express';
import verifyAccess from '../../../lib/verify-access.js';

const router = express.Router();

router.delete('/', verifyAccess(), async (req, res) => {
	const {
		models,
		errors: { HttpError }
	} = req.app.locals;

	try {
		const user = await models.user.findByPk(req.token.userId);
		if (!user) throw new HttpError(404, 'user not found');

		await user.destroy();
		res.status(204).send();
	} catch (e) {
		res.status(500).error(e);
	}
});

export default router;
