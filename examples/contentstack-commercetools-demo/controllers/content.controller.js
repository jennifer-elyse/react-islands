import { getLandingPage, getHeroBanners } from '../models/contentstack.model.js';

export const getHomeContent = async (req, res) => {
	try {
		const slug = req.query.slug || 'home';
		const data = await getLandingPage(slug);
		if (!data) return res.status(404).json({ error: 'Content not found' });
		res.json({ page: data });
	} catch (err) {
		res.status(500).json({ error: err?.message || 'Contentstack error' });
	}
};

export const getHeroContent = async (req, res) => {
	try {
		const data = await getHeroBanners({ locale: req.query.locale });
		res.json({ heroes: data });
	} catch (err) {
		res.status(500).json({ error: err?.message || 'Contentstack error' });
	}
};
