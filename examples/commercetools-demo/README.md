# React Islands Commercetools Demo

This demo uses commercetools for product, cart, and search data. Content uses the shared surf shop demo data.

## Usage

```sh
yarn dev:commercetools
```

Open http://localhost:3000

## Required environment

```sh
CTP_PROJECT_KEY=your-project
CTP_CLIENT_ID=your-client-id
CTP_CLIENT_SECRET=your-client-secret
CTP_SCOPES=your-scopes
CTP_REGION=your-region
```

## Environment overrides

This demo loads `.env` plus `.env.commercetools` if present.
