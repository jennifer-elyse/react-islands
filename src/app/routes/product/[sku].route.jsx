import React from 'react';

const toViewModel = (p, sku) => {
	if (!p) return null;

	const images = Array.isArray(p.images)
		? p.images.filter(Boolean)
		: p.masterVariant?.images?.map((img) => img.url).filter(Boolean) || [];

	const priceDisplay =
		p.price?.display ||
		(typeof p.price?.centAmount === 'number'
			? `$${(p.price.centAmount / 100).toFixed(2)}`
			: typeof p.price === 'number'
			  ? `$${Number(p.price).toFixed(2)}`
			  : null);

	return {
		id: p.id || p.productId || null,
		sku: p.sku || p.slug || sku,
		name: p.name || p.title || 'Product',
		description: p.description || 'Product details unavailable.',
		imageUrl: p.imageUrl || images[0] || null,
		images,
		priceText: priceDisplay || '$—',
		variantId: p.variantId || p.masterVariant?.id || 1,
	};
};

export const loader = async ({ req, params }) => {
	const sku = params.sku;

	if (req.commerce) {
		try {
			const product = await req.commerce.getProductBySku({ sku });
			const view = toViewModel(product, sku);
			if (view) {
				return { product: view };
			}
		} catch {
			// fallback below
		}
	}

	return {
		product: toViewModel(
			{
				sku,
				title: `Product ${sku}`,
				description: 'Server-rendered product page.',
				price: 3.99,
				imageUrl: null,
				productId: sku,
			},
			sku,
		),
	};
};

export const head = (props) => ({ title: props.product?.name || 'Product' });

export const Page = ({ product }) => {
	return (
		<main style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24 }}>
			<div>
				{product.imageUrl ? (
					<img
						src={product.imageUrl}
						alt={product.name}
						style={{ width: '100%', maxWidth: 320, borderRadius: 8, border: '1px solid #eee' }}
					/>
				) : (
					<div
						style={{
							width: '100%',
							height: 240,
							background: '#f7f7f7',
							border: '1px dashed #ddd',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							color: '#999',
							borderRadius: 8,
						}}
					>
						No image
					</div>
				)}
			</div>

			<div>
				<h1 style={{ marginTop: 0 }}>{product.name}</h1>
				<div style={{ opacity: 0.7, marginBottom: 8 }}>SKU: {product.sku}</div>
				<p style={{ lineHeight: 1.6 }}>{product.description}</p>
				<div style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>{product.priceText}</div>

				<form method="post" action="/api/cart/items" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
					<input type="hidden" name="productId" value={product.id || ''} />
					<input type="hidden" name="variantId" value={product.variantId || 1} />
					<label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
						<span>Qty</span>
						<input
							type="number"
							name="quantity"
							min={1}
							defaultValue={1}
							style={{ width: 68, padding: '6px 8px' }}
						/>
					</label>
					<button type="submit" disabled={!product.id} style={{ padding: '8px 14px', cursor: 'pointer' }}>
						Add to cart
					</button>
				</form>

				{!product.id && (
					<p style={{ color: '#c0392b', marginTop: 8 }}>Cannot add to cart without product id.</p>
				)}
			</div>
		</main>
	);
};
