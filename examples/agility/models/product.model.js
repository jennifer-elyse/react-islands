import { listSurfProducts, getSurfProductBySku } from '../../_shared/data/surf-shop.js';

export const listProducts = async (options = {}) => listSurfProducts(options);

export const getProductBySlug = async (sku, { currency = process.env.CART_CURRENCY || 'USD' } = {}) =>
	getSurfProductBySku(sku, currency);
