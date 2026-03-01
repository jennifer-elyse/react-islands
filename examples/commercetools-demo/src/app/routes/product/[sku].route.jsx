import React from 'react';
import { getProductBySlug } from '../../../../../../models/product.model.js';

export const loader = async ({ params }) => {
  const product = await getProductBySlug(params.sku);
  return { product };
};

export const head = (props) => ({ title: props.product?.name || 'Product' });

export const Page = ({ product }) => {
  return (
    <main>
      <h1 style={{ marginTop: 0 }}>{product?.name || 'Product'}</h1>
      <div style={{ opacity: 0.7, marginBottom: 8 }}>SKU: {product?.sku}</div>
      <p>{product?.description || 'No description.'}</p>
      <div style={{ fontSize: 20, fontWeight: 700 }}>{product?.price?.display || '$—'}</div>
    </main>
  );
};
