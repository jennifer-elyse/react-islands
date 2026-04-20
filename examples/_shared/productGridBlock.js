const defaultGridFallbackImages = ['/app-images/bouquet.png', '/app-images/fruit-basket.png', '/app-images/grill.png'];

const toDeterministicIndex = (value, size) => {
	const source = String(value || '');
	if (!source || !size) return 0;

	let total = 0;
	for (let index = 0; index < source.length; index += 1) {
		total += source.charCodeAt(index);
	}

	return total % size;
};

export const getDefaultProductFallbackImage = (productOrKey) => {
	const key =
		productOrKey?.sku ||
		productOrKey?.slug ||
		productOrKey?.id ||
		(typeof productOrKey === 'string' ? productOrKey : '');

	return defaultGridFallbackImages[toDeterministicIndex(key, defaultGridFallbackImages.length)];
};

export const createPlpProductsBlock = ({
	title = 'Products',
	products = [],
	resolveImage,
	resolveFallbackImage,
	resolveEyebrow,
	resolveMeta,
} = {}) => {
	const items = (Array.isArray(products) ? products : []).filter(Boolean).map((product) => {
		const fallbackImage = resolveFallbackImage
			? resolveFallbackImage(product)
			: getDefaultProductFallbackImage(product);
		const primaryImage = resolveImage
			? resolveImage(product, fallbackImage)
			: product?.imageUrl || product?.images?.[0] || fallbackImage;
		const meta = resolveMeta ? resolveMeta(product) : [product?.price?.display || '$—', product?.description || null];

		return {
			title: product?.name || product?.title || 'Product',
			image: primaryImage || fallbackImage || null,
			fallbackImage,
			imageAlt: product?.name || product?.title || 'Product',
			href: `/products/${encodeURIComponent(product?.slug || product?.sku || product?.id || '')}`,
			eyebrow: resolveEyebrow ? resolveEyebrow(product) : product?.tags?.[0] || product?.categories?.[0] || null,
			meta: Array.isArray(meta) ? meta.filter(Boolean) : [],
		};
	});

	return {
		type: 'plp_products',
		title,
		items,
	};
};
