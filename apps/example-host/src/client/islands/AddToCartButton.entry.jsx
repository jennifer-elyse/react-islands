import React from "react";

const AddToCartButton = ({ sku }) => {
	return (
		<button
			type="button"
			onClick={() => {
				// Example interactive behavior
				// eslint-disable-next-line no-console
				console.log("Add to cart", { sku });
			}}
		>
			Add to cart
		</button>
	);
};

export default AddToCartButton;
