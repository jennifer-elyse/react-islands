import React from 'react';
import { Island, resolveIslandModule } from 'react-island-runtime/ssr';

import CartSSR from '../../../../../src/app/islands/Cart.ssr.jsx';
import ProductSearchSSR from '../../../../../src/app/islands/ProductSearch.ssr.jsx';

import { getLandingPage, getHeroBanners } from '../../../models/contentstack.model.js';

const normalizeBlocks = (blocks = []) => {
  const hasSearch = blocks.some((b) => b.type === 'product_search');
  const hasCart = blocks.some((b) => b.type === 'cart_mini');

  const next = [...blocks];
  if (!hasSearch) {
    next.push({ type: 'product_search', islandKey: 'product_search', hydrate: 'immediate' });
  }
  if (!hasCart) {
    next.push({ type: 'cart_mini', islandKey: 'cart', hydrate: 'immediate' });
  }
  return next;
};

export const loader = async () => {
  const page = await getLandingPage('home');
  const rawBlocks = Array.isArray(page?.blocks) ? page.blocks : [];

  let heroBlocks = [];
  if (!rawBlocks.some((b) => b.type === 'hero')) {
    const heroes = await getHeroBanners();
    heroBlocks = (heroes || []).map((hero) => ({
      type: 'hero',
      title: hero?.title || hero?.heading || hero?.name || 'Weekly Ad',
      subtitle: hero?.subtitle || hero?.tagline || hero?.description || '',
    }));
  }

  const blocks = normalizeBlocks([...rawBlocks, ...heroBlocks]);

  return {
    page: {
      title: page?.title || 'Contentstack + Commercetools',
      blocks
    }
  };
};

export const head = (props) => ({ title: props.page?.title || 'Contentstack + Commercetools' });

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
