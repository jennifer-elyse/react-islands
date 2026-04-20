const localGridImages = ['/app-images/bouquet.png', '/app-images/fruit-basket.png', '/app-images/grill.png'];

const toDeterministicIndex = (value) => {
	const source = String(value || '');
	if (!source) return 0;

	let total = 0;
	for (let index = 0; index < source.length; index += 1) {
		total += source.charCodeAt(index);
	}

	return total % localGridImages.length;
};

export const getLocalProductFallbackImage = (productOrKey) => {
	const key =
		productOrKey?.sku ||
		productOrKey?.slug ||
		productOrKey?.id ||
		(typeof productOrKey === 'string' ? productOrKey : '');

	return localGridImages[toDeterministicIndex(key)];
};

export const getPreferredProductImage = (product) =>
	product?.localFallbackImage || product?.imageUrl || product?.images?.[0] || getLocalProductFallbackImage(product);
