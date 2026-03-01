import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, 'surf-shop.json');

const readData = () => JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const toPrice = (centAmount, currencyCode = 'USD') => ({
  centAmount,
  currencyCode,
  display: `$${(centAmount / 100).toFixed(2)}`
});

export const listSurfProducts = ({ limit = 20, offset = 0, currencyCode = 'USD' } = {}) => {
  const items = readData();
  const sliced = items.slice(offset, offset + limit);
  return {
    products: sliced.map((item) => ({
      id: item.id,
      sku: item.sku,
      name: item.name,
      description: item.description,
      imageUrl: item.image,
      images: [item.image],
      price: toPrice(item.price, currencyCode),
      tags: item.tags || []
    })),
    total: items.length,
    offset,
    count: sliced.length
  };
};

export const getSurfProductBySku = (sku, currencyCode = 'USD') => {
  const items = readData();
  const item = items.find((p) => p.sku === sku || p.id === sku);
  if (!item) return null;
  return {
    id: item.id,
    sku: item.sku,
    name: item.name,
    description: item.description,
    imageUrl: item.image,
    images: [item.image],
    price: toPrice(item.price, currencyCode),
    tags: item.tags || []
  };
};

export const listSurfSuggestions = ({ query = '', limit = 8 } = {}) => {
  const q = String(query || '').toLowerCase();
  if (!q || q.length < 2) return { suggestions: [] };
  const items = readData().filter((item) => item.name.toLowerCase().includes(q));
  return {
    suggestions: items.slice(0, limit).map((item) => ({
      id: item.id,
      type: 'product',
      text: item.name,
      slug: item.sku,
      imageUrl: item.image,
      price: `$${(item.price / 100).toFixed(2)}`,
      sku: item.sku
    }))
  };
};
