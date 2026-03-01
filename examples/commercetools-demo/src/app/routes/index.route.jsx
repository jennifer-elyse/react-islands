import React from 'react';
import { Island, resolveIslandModule } from 'react-island-runtime/ssr';

import CartSSR from '../../../../../src/app/islands/Cart.ssr.jsx';
import ProductSearchSSR from '../../../../../src/app/islands/ProductSearch.ssr.jsx';

import { getLandingPage } from '../../../models/content.model.js';

export const loader = async () => {
  const page = await getLandingPage();
  return { page };
};

export const head = (props) => ({ title: props.page?.title || 'Commercetools Demo' });

export const Page = ({ page }) => {
  return (
    <main>
      {(page?.blocks || []).map((b, i) => {
        if (b.type === 'hero') {
          return (
            <section key={i} style={{ marginBottom: 24 }}>
              <h1 style={{ margin: 0 }}>{b.title}</h1>
              <p style={{ marginTop: 8 }}>{b.subtitle}</p>
            </section>
          );
        }

        if (b.type === 'promo') {
          return (
            <section key={i} style={{ marginBottom: 24, padding: 16, border: '1px solid #eee' }}>
              <strong>{b.title}</strong>
              <p style={{ marginTop: 8 }}>{b.body}</p>
            </section>
          );
        }

        if (b.type === 'product_search') {
          return (
            <section key={i} style={{ marginBottom: 24 }}>
              <h2>Search</h2>
              <Island
                islandKey={b.islandKey}
                hydrate={b.hydrate || 'immediate'}
                props={{ placeholder: 'Search products...' }}
                resolveIslandModule={resolveIslandModule}
              >
                <ProductSearchSSR placeholder="Search products..." />
              </Island>
            </section>
          );
        }

        if (b.type === 'cart_mini') {
          return (
            <section key={i} style={{ marginBottom: 24 }}>
              <h2>Cart</h2>
              <Island
                islandKey={b.islandKey}
                hydrate={b.hydrate || 'immediate'}
                props={{}}
                resolveIslandModule={resolveIslandModule}
              >
                <CartSSR />
              </Island>
            </section>
          );
        }

        return null;
      })}
    </main>
  );
};
