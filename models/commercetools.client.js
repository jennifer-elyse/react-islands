// models/commercetoolsClient.js

import 'dotenv/config';

import fetch from 'node-fetch';

import { ClientBuilder } from '@commercetools/ts-client';

import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';

const { CTP_PROJECT_KEY, CTP_CLIENT_ID, CTP_CLIENT_SECRET, CTP_SCOPES, CTP_REGION } = process.env;

if (!CTP_PROJECT_KEY || !CTP_CLIENT_ID || !CTP_CLIENT_SECRET || !CTP_SCOPES || !CTP_REGION) {
	throw new Error(
		'Missing required commercetools env vars (CTP_PROJECT_KEY, CTP_CLIENT_ID, CTP_CLIENT_SECRET, CTP_SCOPES, CTP_REGION)',
	);
}

const scopes = CTP_SCOPES.split(' ').filter(Boolean);
const regionHost = CTP_REGION.includes('.') ? CTP_REGION : `${CTP_REGION}.gcp`;

// Log configuration on startup (remove in production)
console.log({
	CTP_PROJECT_KEY,
	CTP_REGION,
	regionHost,
	apiHost: `https://api.${regionHost}.commercetools.com`,
	authHost: `https://auth.${regionHost}.commercetools.com`,
});

const authMiddlewareOptions = {
	host: `https://auth.${regionHost}.commercetools.com`,
	projectKey: CTP_PROJECT_KEY,
	credentials: {
		clientId: CTP_CLIENT_ID,
		clientSecret: CTP_CLIENT_SECRET,
	},
	scopes,
	httpClient: fetch,
};

const httpMiddlewareOptions = {
	host: `https://api.${regionHost}.commercetools.com`,
	httpClient: fetch,
};

const ctpClientHTTPAPI = new ClientBuilder()
	.withProjectKey(CTP_PROJECT_KEY)
	.withClientCredentialsFlow(authMiddlewareOptions)
	.withHttpMiddleware(httpMiddlewareOptions)
	.withLoggerMiddleware()
	.build();

const apiRoot = createApiBuilderFromCtpClient(ctpClientHTTPAPI).withProjectKey({
	projectKey: CTP_PROJECT_KEY,
});

export { apiRoot, CTP_PROJECT_KEY };
