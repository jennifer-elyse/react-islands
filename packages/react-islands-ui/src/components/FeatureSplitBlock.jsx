import React from 'react';
import { resolveComponentDesignSystem } from '../designSystem/resolveComponentDesignSystem.js';

const fallbackProducts = [
	{
		name: 'Surf Shop Fixture',
		description: 'Shared fixture content for homepage layout checks.',
		imageUrl: '/images/liquid-glass-board.jpg',
		price: { display: '$0.00' },
		tags: ['example'],
	},
];

const getProductSlice = (products = [], start = 0) => {
	if (!Array.isArray(products) || products.length === 0) return fallbackProducts;
	const picked = [];
	for (let i = 0; i < Math.min(products.length, 3); i += 1) {
		picked.push(products[(start + i) % products.length]);
	}
	return picked;
};

const getGalleryImages = (products = []) => {
	const seen = new Set();
	const images = [];

	for (const product of products) {
		for (const image of product?.images || []) {
			if (!image || seen.has(image)) continue;
			seen.add(image);
			images.push(image);
		}
	}

	return images.slice(0, 4);
};

export const FeatureSplitBlock = ({ block, products = [], layoutIndex = 0, className = '', designSystem }) => {
	const reverse = layoutIndex % 2 === 1;
	const selected = getProductSlice(products, layoutIndex * 2);
	const [leadProduct, supportingProduct, detailProduct] = selected;
	const galleryImages = getGalleryImages(selected);
	const rootDesign = resolveComponentDesignSystem({
		componentName: 'featureSplitBlock',
		designSystem,
		className: [reverse ? 'feature--reverse' : '', className].filter(Boolean).join(' '),
		defaultClassName: 'feature',
		defaultAttrs: { 'data-feature-layout': reverse ? 'reverse' : 'default' },
	});

	return (
		<section className={rootDesign.className} style={rootDesign.style} {...rootDesign.attrs}>
			<div className="feature__content">
				<span className="feature__eyebrow">
					{block?.eyebrow || leadProduct?.tags?.[0] || 'Featured Layout'}
				</span>
				<h2 className="feature__title">{block?.title || 'Featured Products'}</h2>
				<p className="feature__body">
					{block?.body || block?.subtitle || 'Shared merchandising layout block.'}
				</p>
				<div className="feature__chips">
					{selected.map((product) => (
						<span key={product.sku || product.id || product.name} className="feature__chip">
							{product.name}
						</span>
					))}
				</div>
			</div>

			<div className="feature__visual" aria-hidden="true">
				<article className="feature__lead-card">
					<div className="feature__lead-media">
						<img src={leadProduct?.imageUrl} alt="" />
					</div>
					<div className="feature__lead-copy">
						<div className="feature__product-kicker">{leadProduct?.tags?.[0] || 'Product'}</div>
						<div className="feature__product-name">{leadProduct?.name}</div>
						<div className="feature__product-price">{leadProduct?.price?.display || ''}</div>
						{galleryImages.length > 1 ? (
							<div className="feature__thumbs">
								{galleryImages.map((image, index) => (
									<img
										key={`${leadProduct?.sku || leadProduct?.name || 'feature'}-${index}-${image}`}
										src={image}
										alt=""
										className="feature__thumb"
									/>
								))}
							</div>
						) : null}
					</div>
				</article>

				<div className="feature__supporting">
					{[supportingProduct, detailProduct].filter(Boolean).map((product) => (
						<article key={product.sku || product.id || product.name} className="feature__support-card">
							<img src={product.imageUrl} alt="" className="feature__support-media" />
							<div className="feature__support-copy">
								<div className="feature__product-name">{product.name}</div>
								<div className="feature__support-body">{product.description}</div>
							</div>
						</article>
					))}
				</div>
			</div>
		</section>
	);
};
