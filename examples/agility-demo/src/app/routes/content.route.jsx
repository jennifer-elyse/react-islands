import React from 'react';
import { getHeroBanners } from '../../../models/agility.model.js';

export const loader = async () => {
  const heroes = await getHeroBanners();
  return { heroes };
};

export const head = () => ({ title: 'Content' });

export const Page = ({ heroes }) => {
  return (
    <main>
      <h1 style={{ marginTop: 0 }}>Hero Banners</h1>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {heroes.map((h, i) => (
          <li key={i} style={{ padding: '12px 0', borderBottom: '1px solid #eee' }}>
            <strong>{h.title}</strong>
            <div style={{ opacity: 0.7 }}>{h.subtitle}</div>
          </li>
        ))}
      </ul>
    </main>
  );
};
