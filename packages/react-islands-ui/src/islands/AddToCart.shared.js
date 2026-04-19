export const addToCartClassNames = {
	control: 'add-to-cart-control',
	controlOpen: 'add-to-cart-control--open',
	button: 'add-to-cart-control__button',
	buttonGhost: 'add-to-cart-control__button--ghost',
	buttonPrimary: 'add-to-cart-control__button--primary',
	count: 'add-to-cart-control__count',
	icon: 'add-to-cart-control__icon',
	srText: 'add-to-cart-control__sr-text',
};

export const addToCartStyles = `
	.add-to-cart-control {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.2rem;
		min-height: 2.75rem;
		padding: 0;
		border-radius: 999px;
		border: 1px solid color-mix(in srgb, var(--interactive-link, var(--surface-accent)) 22%, transparent);
		background: color-mix(in srgb, var(--interactive-link, var(--surface-accent)) 10%, white);
		color: var(--interactive-link, var(--surface-accent));
		font-family: var(--font-ui, inherit);
		line-height: 1;
		transition:
			transform var(--motion-fast, 180ms) ease,
			opacity var(--motion-fast, 180ms) ease,
			background-color var(--motion-fast, 180ms) ease,
			border-color var(--motion-fast, 180ms) ease;
		touch-action: manipulation;
	}

	.add-to-cart-control--open {
		padding: 0.2rem;
	}

	.add-to-cart-control__button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 2.35rem;
		height: 2.35rem;
		padding: 0;
		border: 0;
		border-radius: 999px;
		background: transparent;
		color: inherit;
		font-family: inherit;
		font-size: 1.4rem;
		font-weight: 800;
		line-height: 1;
		cursor: pointer;
		transition:
			transform var(--motion-fast, 180ms) ease,
			background-color var(--motion-fast, 180ms) ease,
			color var(--motion-fast, 180ms) ease,
			opacity var(--motion-fast, 180ms) ease;
	}

	.add-to-cart-control__button:hover:not(:disabled) {
		background: color-mix(in srgb, var(--interactive-link, var(--surface-accent)) 12%, white);
		}

	.add-to-cart-control__button--ghost {
		background: color-mix(in srgb, var(--interactive-link, var(--surface-accent)) 12%, white);
		color: var(--interactive-link, var(--surface-accent));
	}

	.add-to-cart-control__button--ghost:hover:not(:disabled) {
		background: color-mix(in srgb, var(--interactive-link, var(--surface-accent)) 18%, white);
	}

	.add-to-cart-control__button--primary {
		background: var(--interactive-link, var(--surface-accent));
		color: #ffffff;
	}

	.add-to-cart-control__button--primary:hover:not(:disabled) {
		background: color-mix(in srgb, var(--interactive-link, var(--surface-accent)) 88%, black);
	}

	.add-to-cart-control__count {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 2rem;
		padding: 0 0.45rem;
		font-size: 1rem;
		font-weight: 800;
		color: var(--text-primary, currentColor);
	}

	.add-to-cart-control__icon {
		width: 1.2rem;
		height: 1.2rem;
		display: block;
	}

	.add-to-cart-control__button:disabled,
	.add-to-cart-control[data-invalid="true"] .add-to-cart-control__button,
	.add-to-cart-control[data-pending="true"] .add-to-cart-control__button {
		opacity: 0.7;
		cursor: progress;
	}

	.add-to-cart-control[data-invalid="true"] .add-to-cart-control__button {
		cursor: not-allowed;
	}

	.add-to-cart-control__sr-text {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}
`;

export const getCartQuantity = (cart, sku) => {
	if (!cart) return 0;
	if (!sku) return Number(cart.itemCount) || 0;
	return (cart.items || []).reduce((total, item) => (item.sku === sku ? total + (item.quantity || 0) : total), 0);
};

export const getAddToCartLabel = ({ pending, quantity, label = 'Add to cart' }) => {
	if (pending) return 'Updating order';
	if (quantity > 0) return `${label}, quantity ${quantity}`;
	return label;
};
