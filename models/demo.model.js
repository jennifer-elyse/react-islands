const DEFAULT_CURRENCY = process.env.CART_CURRENCY || 'USD';

const toPrice = (centAmount) => ({
  centAmount,
  currencyCode: DEFAULT_CURRENCY,
  display: `$${(centAmount / 100).toFixed(2)}`
});

const demoProducts = [
  {
    id: 'demo-1',
    sku: 'demo-1',
    slug: 'demo-1',
    name: 'Demo Product 1',
    description: 'Demo product description.',
    imageUrl: null,
    images: [],
    price: toPrice(1999),
    categories: []
  },
  {
    id: 'demo-2',
    sku: 'demo-2',
    slug: 'demo-2',
    name: 'Demo Product 2',
    description: 'Demo product description.',
    imageUrl: null,
    images: [],
    price: toPrice(2999),
    categories: []
  },
  {
    id: 'demo-3',
    sku: 'demo-3',
    slug: 'demo-3',
    name: 'Demo Product 3',
    description: 'Demo product description.',
    imageUrl: null,
    images: [],
    price: toPrice(1599),
    categories: []
  }
];

const listDemoProducts = ({ limit = 20, offset = 0 } = {}) => {
  const items = demoProducts.slice(offset, offset + limit);
  return {
    products: items,
    total: demoProducts.length,
    offset,
    count: items.length
  };
};

const getDemoProductById = (id) =>
  demoProducts.find((p) => p.id === id || p.sku === id) || null;

const getDemoProductBySlug = (slug) =>
  demoProducts.find((p) => p.slug === slug || p.sku === slug) || null;

export {
  demoProducts,
  listDemoProducts,
  getDemoProductById,
  getDemoProductBySlug
};
