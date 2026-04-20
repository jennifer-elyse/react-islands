import React from 'react';
import { Island, resolveIslandModule } from 'react-islands-runtime/ssr';
import AddToCartSSR from '../islands/AddToCart.ssr.jsx';

export const AddToCartButton = ({ product, label = 'Add to cart', quantity = 1, hydrate = 'immediate' }) => {
	if (!product?.sku) return null;

	return (
		<Island
			islandKey="add_to_cart"
			hydrate={hydrate}
			props={{
				sku: product.sku,
				name: product.name,
				imageUrl: product.imageUrl || product.images?.[0] || null,
				priceCentAmount: product.price?.centAmount || 0,
				quantity,
				label,
			}}
			resolveIslandModule={resolveIslandModule}
		>
			<AddToCartSSR label={label} />
		</Island>
	);
};
