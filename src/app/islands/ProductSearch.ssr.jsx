import React from 'react';

const ProductSearchSSR = ({ placeholder }) => {
	return (
		<div>
			<input
				type="search"
				placeholder={placeholder}
				style={{ width: '100%', padding: 10, fontSize: 16 }}
				readOnly={false}
			/>
		</div>
	);
};

export default ProductSearchSSR;
