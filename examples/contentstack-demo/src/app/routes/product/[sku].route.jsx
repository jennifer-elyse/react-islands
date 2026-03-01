import React from 'react';
import { getProductBySku } from '../../../../models/commercetools.client.js';

export const loader = async ({ params }) => {
  const product = await getProductBySku(params.sku);

  return {
    product: product || {
      sku: params.sku,
      name: `Product ${params.sku}`,
      price: 3.99,
      description: 'Demo product details.'
    }
  };
};

export const head = (props) => ({ title: props.product?.name || 'Product' });

export const Page = ({ product }) => {
  const priceValue = product?.price;
  let priceText = '$—';
  if (typeof priceValue === 'number') {
    priceText = `$${priceValue.toFixed(2)}`;
  } else if (typeof priceValue === 'string') {
    priceText = priceValue;
  } else if (priceValue && typeof priceValue === 'object') {
    if (typeof priceValue.display === 'string') {
      priceText = priceValue.display;
    } else if (typeof priceValue.centAmount === 'number') {
      priceText = `$${(priceValue.centAmount / 100).toFixed(2)}`;
    }
  }

  return (
    <main>
      <h1 style={{ marginTop: 0 }}>{product.name}</h1>
      <div style={{ opacity: 0.7, marginBottom: 8 }}>SKU: {product.sku}</div>
      <p>{product.description || 'No description.'}</p>
      <div style={{ fontSize: 20, fontWeight: 700 }}>
        {priceText}
      </div>
    </main>
  );
};
