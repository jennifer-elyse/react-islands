import { getLandingPage, getHeroBanners } from '../models/agility.model.js';

export const getHomeContent = async (req, res) => {
	const slug = req.query.slug || 'home';
	const data = await getLandingPage(slug);
	res.json({ page: data });
};

export const getHeroContent = async (req, res) => {
	const data = await getHeroBanners();
	res.json({ heroes: data });
};
