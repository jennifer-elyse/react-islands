# React Islands Contentstack + Commercetools Demo

This demo uses Contentstack for content and commercetools for product/cart/search.

## Usage

```sh
yarn dev:contentstack-commercetools
```

Open http://localhost:3003

## Required environment

```sh
CONTENTSTACK_API_KEY=your-api-key
CONTENTSTACK_DELIVERY_TOKEN=your-delivery-token
CONTENTSTACK_ENVIRONMENT=development
CONTENTSTACK_REGION=gcp-na
CTP_PROJECT_KEY=your-project
CTP_CLIENT_ID=your-client-id
CTP_CLIENT_SECRET=your-client-secret
CTP_SCOPES=your-scopes
CTP_REGION=your-region
```

## Environment overrides

This demo loads `.env` plus `.env.contentstack-commercetools` if present.
