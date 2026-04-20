import React from 'react';
import {
	addToCartClassNames,
	addToCartStyles,
	getAddToCartLabel,
} from './AddToCart.shared.js';

const AddToCartSSR = ({ label = 'Add to cart' }) => {
	return (
		<>
			<style>{addToCartStyles}</style>
			<div className={addToCartClassNames.control}>
				<span className={addToCartClassNames.srText}>{getAddToCartLabel({ label, quantity: 0 })}</span>
				<button
					type="button"
					className={`${addToCartClassNames.button} ${addToCartClassNames.buttonPrimary}`}
					aria-label={getAddToCartLabel({ label, quantity: 0 })}
				>
					+
				</button>
			</div>
		</>
	);
};

export default AddToCartSSR;
