import { getLandingPage } from '../models/content.model.js';

export const getHomeContent = async (_req, res) => {
	try {
		const data = await getLandingPage();
		res.json({ page: data });
	} catch (err) {
		res.status(500).json({ error: err?.message || 'Content error' });
	}
};
