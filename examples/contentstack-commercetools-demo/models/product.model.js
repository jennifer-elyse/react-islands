import { listProducts as listCtProducts, getProductBySlug as getCtProductBySlug } from '../../../models/product.model.js';
import { getProductImagesBySkus } from './contentstack.model.js';

const mergeImages = (product, media) => {
  if (!product || !media) return product;

  const hasImages = Array.isArray(media.images) && media.images.length > 0;
  const imageUrl = media.imageUrl || (hasImages ? media.images[0] : null);

  if (!imageUrl && !hasImages) {
    return product;
  }

  return {
    ...product,
    imageUrl: imageUrl || product.imageUrl || null,
    images: hasImages ? media.images : (product.images || (imageUrl ? [imageUrl] : [])),
  };
};

export const listProducts = async (options = {}) => {
  const result = await listCtProducts(options);
  const products = result?.products || [];
  const skus = products.map((item) => item.sku).filter(Boolean);
  let mediaMap = {};

  if (skus.length) {
    try {
      mediaMap = await getProductImagesBySkus(skus, { locale: options.locale });
    } catch {
      mediaMap = {};
    }
  }

  return {
    ...result,
    products: products.map((product) => mergeImages(product, mediaMap[product.sku])),
  };
};

export const getProductBySlug = async (sku, options = {}) => {
  const product = await getCtProductBySlug(sku, options);
  if (!product) return product;

  let mediaMap = {};
  try {
    mediaMap = await getProductImagesBySkus([product.sku || sku], { locale: options.locale });
  } catch {
    mediaMap = {};
  }

  return mergeImages(product, mediaMap[product.sku || sku]);
};
