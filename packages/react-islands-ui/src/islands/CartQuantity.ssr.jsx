import React from 'react';

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

const CartQuantitySSR = ({ label = 'In cart', quantity = 0 }) => {
	return (
		<div style={badgeStyle} aria-live="polite">
			{label}: {quantity}
		</div>
	);
};

export default CartQuantitySSR;
