<<<<<<< Updated upstream
export { getProductBySlug, listProducts } from '../../_shared/models/product.model.js';
=======
import { listSurfProducts, getSurfProductBySku } from '../../_shared/app-data/surf-shop.js';

export const listProducts = async (options = {}) => listSurfProducts(options);

export const getProductBySlug = async (sku, { currency = process.env.CART_CURRENCY || 'USD' } = {}) =>
	getSurfProductBySku(sku, currency);
>>>>>>> Stashed changes
