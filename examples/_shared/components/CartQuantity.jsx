import React from 'react';
import { Island, resolveIslandModule } from 'react-islands-runtime/ssr';

import { CartQuantitySSR } from 'react-islands-ui';

export const CartQuantity = ({ sku, label = 'In cart', hydrate = 'immediate' }) => {
	return (
		<Island
			islandKey="cart_quantity"
			hydrate={hydrate}
			props={{ sku, label }}
			resolveIslandModule={resolveIslandModule}
		>
			<CartQuantitySSR label={label} quantity={0} />
		</Island>
	);
};
