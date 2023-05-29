import express from 'express';

const router = express.Router();

router.get('/', async (req, res) => {
	try {
		res.status(200).json({});
	} catch (e) {
		res.status(500).error(e);
	}
});

export default router;
