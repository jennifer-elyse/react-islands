import { getProducts, getProductBySku } from '../models/commercetools.client.js';

export const listProducts = async (req, res) => {
  const products = await getProducts();
  res.json({ products });
};

export const getProduct = async (req, res) => {
  const product = await getProductBySku(req.params.sku);
  if (!product) return res.status(404).json({ error: 'Not found' });
  res.json({ product });
};
