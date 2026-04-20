import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, 'surf-shop.json');

const readData = () => JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const toPrice = (centAmount, currencyCode = 'USD') => ({
	centAmount,
	currencyCode,
	display: `$${(centAmount / 100).toFixed(2)}`,
});

const pickPreferredImage = (item) => {
	const candidates = [item?.image, ...(Array.isArray(item?.images) ? item.images : [])].filter(Boolean);
	return candidates.find((src) => src.endsWith('.jpg')) || candidates[0] || null;
};

const buildImageList = (item) => {
	const candidates = [
		pickPreferredImage(item),
		...(Array.isArray(item?.images) ? item.images : []),
		item?.image,
	].filter(Boolean);
	return [...new Set(candidates)];
};

const resolveImage = (item) => pickPreferredImage(item) || buildImageList(item)[0] || null;

const matchesQuery = (item, query) => {
	if (!query) return true;
	const q = query.toLowerCase();
	const haystack = [item.name, item.description, item.sku, item.id, ...(item.tags || [])]
		.filter(Boolean)
		.join(' ')
		.toLowerCase();
	return haystack.includes(q);
};

export const listSurfProducts = ({ query = '', limit = 20, offset = 0, currencyCode = 'USD' } = {}) => {
	const items = readData();
	const filtered = items.filter((item) => matchesQuery(item, query));
	const sliced = filtered.slice(offset, offset + limit);
	return {
		products: sliced.map((item) => ({
			id: item.id,
			sku: item.sku,
			name: item.name,
			description: item.description,
			imageUrl: pickPreferredImage(item),
			images: buildImageList(item),
			price: toPrice(item.price, currencyCode),
			tags: item.tags || [],
		})),
		total: filtered.length,
		offset,
		count: sliced.length,
	};
};

export const getSurfProductBySku = (sku, currencyCode = 'USD') => {
	const items = readData();
	const item = items.find((p) => p.sku === sku || p.id === sku);
	if (!item) return null;
	return {
		id: item.id,
		sku: item.sku,
		name: item.name,
		description: item.description,
		imageUrl: pickPreferredImage(item),
		images: buildImageList(item),
		price: toPrice(item.price, currencyCode),
		tags: item.tags || [],
	};
};

export const listSurfSuggestions = ({ query = '', limit = 8 } = {}) => {
	const q = String(query || '').toLowerCase();
	if (!q || q.length < 2) return { suggestions: [] };
	const items = readData().filter((item) => matchesQuery(item, q));
	return {
		suggestions: items.slice(0, limit).map((item) => ({
			id: item.id,
			type: 'product',
			text: item.name,
			slug: item.sku,
			imageUrl: pickPreferredImage(item),
			price: `$${(item.price / 100).toFixed(2)}`,
			sku: item.sku,
		})),
	};
};

export const getSurfCarouselSlides = ({ skus } = {}) => {
	const items = readData();
	const source =
		Array.isArray(skus) && skus.length
			? skus.map((sku) => items.find((item) => item.sku === sku)).filter(Boolean)
			: items;

	return source.map((item) => ({
		eyebrow: item.sku.toUpperCase(),
		title: item.name,
		body: item.description,
		image: resolveImage(item),
	}));
};
