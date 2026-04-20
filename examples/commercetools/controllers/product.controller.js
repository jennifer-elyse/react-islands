import { listProducts, getProductBySlug } from '../models/product.model.js';

export const listProductsHandler = async (_req, res) => {
	const result = await listProducts({ limit: 20 });
	res.json({ products: result.products || [] });
};

export const getProduct = async (req, res) => {
	const product = await getProductBySlug(req.params.sku);
	if (!product) return res.status(404).json({ error: 'Not found' });
	res.json({ product });
};
