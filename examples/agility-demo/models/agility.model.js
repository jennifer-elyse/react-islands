// Demo Agility CMS model (self-contained)
const AGILITY_GUID = process.env.AGILITY_GUID;
const AGILITY_API_KEY = process.env.AGILITY_API_KEY;
const AGILITY_LOCALE = process.env.AGILITY_LOCALE || 'en-us';

const hasCredentials = Boolean(AGILITY_GUID && AGILITY_API_KEY);

const fetchAgilityList = async (contentType) => {
	if (!hasCredentials) return [];

	const url = `https://api.agilitycms.com/v1/${AGILITY_GUID}/content/list/${contentType}?locale=${AGILITY_LOCALE}`;
	const response = await fetch(url, {
		headers: {
			apikey: AGILITY_API_KEY,
			'Content-Type': 'application/json',
		},
	});

	if (!response.ok) return [];
	const data = await response.json();
	return data?.items || [];
};

export const getLandingPage = async (slug) => {
	const entries = await fetchAgilityList('landing_page');
	const entry = entries.find((e) => e.slug === slug) || null;

	if (entry) return entry;

	return {
		slug,
		title: 'Agility Demo Landing Page',
		blocks: [
			{ type: 'hero', title: 'Agility Hero', subtitle: 'Agility mock content' },
			{ type: 'promo', title: 'Agility Promo', body: 'Promotional module' },
		],
	};
};

export const getHeroBanners = async () => {
	const entries = await fetchAgilityList('hero_banner');
	if (entries.length) return entries;

	return [{ title: 'Agility Hero Banner', subtitle: 'Agility mock banner' }];
};
