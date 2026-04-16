import {
	listProducts as listCtProducts,
	getProductBySlug as getCtProductBySlug,
} from '../../_shared/models/product.model.js';

export const listProducts = async (options = {}) => listCtProducts(options);

export const getProductBySlug = async (sku, options = {}) => getCtProductBySlug(sku, options);
