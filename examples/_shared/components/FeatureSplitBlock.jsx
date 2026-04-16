import React from 'react';

const fallbackProducts = [
	{
		name: 'Surf Shop Fixture',
		description: 'Shared fixture content for homepage layout checks.',
		imageUrl: '/demo-images/liquid-glass-board.jpg',
		price: { display: '$0.00' },
		tags: ['demo'],
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

export const FeatureSplitBlock = ({ block, products = [], layoutIndex = 0, className = '' }) => {
	const reverse = layoutIndex % 2 === 1;
	const selected = getProductSlice(products, layoutIndex * 2);
	const [leadProduct, supportingProduct, detailProduct] = selected;
	const galleryImages = getGalleryImages(selected);
	const classes = ['demo-feature', reverse ? 'demo-feature--reverse' : '', className].filter(Boolean).join(' ');

	return (
		<section className={classes}>
			<div className="demo-feature__content">
				<span className="demo-feature__eyebrow">{block?.eyebrow || leadProduct?.tags?.[0] || 'Featured Layout'}</span>
				<h2 className="demo-feature__title">{block?.title || 'Featured Products'}</h2>
				<p className="demo-feature__body">{block?.body || block?.subtitle || 'Shared merchandising layout block.'}</p>
				<div className="demo-feature__chips">
					{selected.map((product) => (
						<span key={product.sku || product.id || product.name} className="demo-feature__chip">
							{product.name}
						</span>
					))}
				</div>
			</div>

			<div className="demo-feature__visual" aria-hidden="true">
				<article className="demo-feature__lead-card">
					<div className="demo-feature__lead-media">
						<img src={leadProduct?.imageUrl} alt="" />
					</div>
					<div className="demo-feature__lead-copy">
						<div className="demo-feature__product-kicker">{leadProduct?.tags?.[0] || 'Product'}</div>
						<div className="demo-feature__product-name">{leadProduct?.name}</div>
						<div className="demo-feature__product-price">{leadProduct?.price?.display || ''}</div>
						{galleryImages.length > 1 ? (
							<div className="demo-feature__thumbs">
								{galleryImages.map((image, index) => (
									<img
										key={`${leadProduct?.sku || leadProduct?.name || 'feature'}-${index}-${image}`}
										src={image}
										alt=""
										className="demo-feature__thumb"
									/>
								))}
							</div>
						) : null}
					</div>
				</article>

				<div className="demo-feature__supporting">
					{[supportingProduct, detailProduct].filter(Boolean).map((product) => (
						<article key={product.sku || product.id || product.name} className="demo-feature__support-card">
							<img src={product.imageUrl} alt="" className="demo-feature__support-media" />
							<div className="demo-feature__support-copy">
								<div className="demo-feature__product-name">{product.name}</div>
								<div className="demo-feature__support-body">{product.description}</div>
							</div>
						</article>
					))}
				</div>
			</div>
		</section>
	);
};
