import { getDefaultProductFallbackImage } from './productGridBlock.js';

export const createProductDetailBlock = ({
	product,
	resolveImage,
	resolveFallbackImage,
	resolvePrice,
	resolveDescription,
	resolveSubtitle,
} = {}) => {
	const fallbackImage = resolveFallbackImage
		? resolveFallbackImage(product)
		: getDefaultProductFallbackImage(product);
	const image = resolveImage ? resolveImage(product, fallbackImage) : product?.imageUrl || product?.images?.[0] || null;
	const price = resolvePrice ? resolvePrice(product) : product?.price?.display || '$—';
	const description = resolveDescription
		? resolveDescription(product)
		: product?.description || product?.name || 'No description.';
	const subtitle = resolveSubtitle ? resolveSubtitle(product) : product?.name || product?.title || 'Product';

	return {
		type: 'product_detail',
		title: product?.name || product?.title || 'Product',
		subtitle,
		description,
		price,
		sku: product?.sku || product?.slug || product?.id || '',
		image,
		fallbackImage,
		imageAlt: product?.name || product?.title || 'Product',
	};
};
