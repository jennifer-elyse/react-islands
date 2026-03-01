import fetch from 'node-fetch';
import { ClientBuilder } from '@commercetools/ts-client';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';

const parseBool = (value) => /^(1|true|yes)$/i.test(String(value || ''));
const isDemoMode = parseBool(process.env.USE_DEMO_DATA);

const { CTP_PROJECT_KEY, CTP_CLIENT_ID, CTP_CLIENT_SECRET, CTP_SCOPES, CTP_REGION } = process.env;

let apiRoot = null;
let projectKey = CTP_PROJECT_KEY || null;

const hasCredentials = Boolean(CTP_PROJECT_KEY && CTP_CLIENT_ID && CTP_CLIENT_SECRET && CTP_SCOPES && CTP_REGION);

if (!isDemoMode && !hasCredentials) {
	console.warn(
		'[commercetools] Missing required env vars; falling back to demo data. Set USE_DEMO_DATA=false and provide creds to enable commercetools.',
	);
}

if (!isDemoMode && hasCredentials) {
	const scopes = CTP_SCOPES.split(' ').filter(Boolean);
	const regionHost = CTP_REGION.includes('.') ? CTP_REGION : `${CTP_REGION}.gcp`;

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
		.build();

	apiRoot = createApiBuilderFromCtpClient(ctpClientHTTPAPI).withProjectKey({
		projectKey: CTP_PROJECT_KEY,
	});
} else {
	projectKey = projectKey || 'demo';
	console.warn('[commercetools] Demo mode enabled; using demo data.');
}

export { apiRoot, projectKey as CTP_PROJECT_KEY, isDemoMode };
