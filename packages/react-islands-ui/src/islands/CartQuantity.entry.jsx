'use client';

import React, { useEffect, useState } from 'react';

const badgeStyle = {
	display: 'inline-flex',
	alignItems: 'center',
	justifyContent: 'center',
	minWidth: '2.25rem',
	minHeight: '2.25rem',
	padding: '0.4rem 0.7rem',
	borderRadius: 'var(--radius-pill, 999px)',
	border: '1px solid var(--border-subtle, currentColor)',
	background: 'var(--surface-panel, transparent)',
	color: 'var(--text-primary, currentColor)',
	fontFamily: 'var(--font-ui, inherit)',
	fontSize: '0.95rem',
	fontWeight: 700,
	lineHeight: 1,
};

const getQuantity = (cart, sku) => {
	if (!cart) return 0;
	if (!sku) return Number(cart.itemCount) || 0;
	return (cart.items || []).reduce((total, item) => (item.sku === sku ? total + (item.quantity || 0) : total), 0);
};

const CartQuantity = ({ sku, label = 'In cart' }) => {
	const [quantity, setQuantity] = useState(0);

	useEffect(() => {
		let canceled = false;

		const syncCart = async () => {
			try {
				const response = await fetch('/api/cart', {
					headers: { Accept: 'application/json' },
				});
				if (!response.ok) return;
				const cart = await response.json();
				if (!canceled) {
					setQuantity(getQuantity(cart, sku));
				}
			} catch {
				// ignore network errors in demo flow
			}
		};

		const handleCartChanged = (event) => {
			if (canceled) return;
			setQuantity(getQuantity(event.detail, sku));
		};

		syncCart();
		window.addEventListener('cart:changed', handleCartChanged);

		return () => {
			canceled = true;
			window.removeEventListener('cart:changed', handleCartChanged);
		};
	}, [sku]);

	return (
		<div style={badgeStyle} aria-live="polite">
			{label}: {quantity}
		</div>
	);
};

export default CartQuantity;
