'use client';

import React, { useEffect, useState } from 'react';
import {
	addToCartClassNames,
	addToCartStyles,
	getAddToCartLabel,
	getCartQuantity,
} from './AddToCart.shared.js';

const TrashIcon = () => (
	<svg
		className={addToCartClassNames.icon}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="1.9"
		strokeLinecap="round"
		strokeLinejoin="round"
		aria-hidden="true"
	>
		<path d="M4 7h16" />
		<path d="M10 3h4" />
		<path d="M7 7l1 12h8l1-12" />
		<path d="M10 11v5" />
		<path d="M14 11v5" />
	</svg>
);

const AddToCart = ({ sku, name, imageUrl, priceCentAmount = 0, quantity = 1, label = 'Add to cart' }) => {
	const [pending, setPending] = useState(false);
	const [currentQuantity, setCurrentQuantity] = useState(0);

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
					setCurrentQuantity(getCartQuantity(cart, sku));
				}
			} catch {
				// ignore network errors in demo flow
			}
		};

		const handleCartChanged = (event) => {
			if (canceled) return;
			setCurrentQuantity(getCartQuantity(event.detail, sku));
		};

		syncCart();
		window.addEventListener('cart:changed', handleCartChanged);

		return () => {
			canceled = true;
			window.removeEventListener('cart:changed', handleCartChanged);
		};
	}, [sku]);

	const syncWithResponse = async (request) => {
		if (!sku || pending) return;

		setPending(true);
		try {
			const response = await request();
			if (!response.ok) return;
			const cart = await response.json();
			setCurrentQuantity(getCartQuantity(cart, sku));
			window.dispatchEvent(new CustomEvent('cart:changed', { detail: cart }));
		} catch {
			// ignore network errors in demo flow
		} finally {
			setPending(false);
		}
	};

	const addOne = () =>
		syncWithResponse(() =>
			fetch('/api/cart/add', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
				},
				body: JSON.stringify({
					sku,
					name,
					imageUrl,
					priceCentAmount,
					quantity,
				}),
			}),
		);

	const updateQuantity = (nextQuantity) =>
		syncWithResponse(() =>
			fetch('/api/cart/items', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
				},
				body: JSON.stringify({
					sku,
					quantity: nextQuantity,
				}),
			}),
		);

	const removeItem = () => {
		if (currentQuantity <= 0) return;
		updateQuantity(0);
	};

	const increment = () => {
		if (currentQuantity <= 0) {
			addOne();
			return;
		}
		updateQuantity(currentQuantity + 1);
	};

	const ariaLabel = getAddToCartLabel({ pending, quantity: currentQuantity, label });

	if (currentQuantity > 0) {
		return (
			<>
				<style>{addToCartStyles}</style>
				<div
					className={`${addToCartClassNames.control} ${addToCartClassNames.controlOpen}`}
					data-invalid={!sku ? 'true' : undefined}
					data-pending={pending ? 'true' : undefined}
				>
					<span className={addToCartClassNames.srText} aria-live="polite">
						{ariaLabel}
					</span>
					<button
						type="button"
						onClick={removeItem}
						className={`${addToCartClassNames.button} ${addToCartClassNames.buttonGhost}`}
						aria-label={`Remove ${name || label} from order`}
						disabled={pending || !sku}
					>
						<TrashIcon />
					</button>
					<span className={addToCartClassNames.count} aria-hidden="true">
						{currentQuantity}
					</span>
					<button
						type="button"
						onClick={increment}
						className={`${addToCartClassNames.button} ${addToCartClassNames.buttonPrimary}`}
						aria-label={`Increase quantity for ${name || label}`}
						disabled={pending || !sku}
					>
						+
					</button>
				</div>
			</>
		);
	}

	return (
		<>
			<style>{addToCartStyles}</style>
			<div
				className={addToCartClassNames.control}
				data-invalid={!sku ? 'true' : undefined}
				data-pending={pending ? 'true' : undefined}
			>
				<span className={addToCartClassNames.srText} aria-live="polite">
					{ariaLabel}
				</span>
				<button
					type="button"
					onClick={addOne}
					className={`${addToCartClassNames.button} ${addToCartClassNames.buttonPrimary}`}
					aria-label={ariaLabel}
					disabled={pending || !sku}
				>
					+
				</button>
			</div>
		</>
	);
};

export default AddToCart;
