import React from 'react';
import { ProductSearchShell } from './ProductSearch.shell.jsx';

const ProductSearchSSR = ({ placeholder }) => {
	return <ProductSearchShell placeholder={placeholder} value="" ariaExpanded={false} />;
};

export default ProductSearchSSR;
