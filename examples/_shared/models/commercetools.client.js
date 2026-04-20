import { ClientBuilder } from '@commercetools/ts-client';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';

const parseBool = (value) => /^(1|true|yes)$/i.test(String(value || ''));
const isMode = parseBool(process.env.USE_EXAMPLE_DATA);

const { CTP_PROJECT_KEY, CTP_CLIENT_ID, CTP_CLIENT_SECRET, CTP_SCOPES, CTP_REGION } = process.env;

let apiRoot = null;
let projectKey = CTP_PROJECT_KEY || null;

const hasCredentials = Boolean(CTP_PROJECT_KEY && CTP_CLIENT_ID && CTP_CLIENT_SECRET && CTP_SCOPES && CTP_REGION);

if (!isMode && !hasCredentials) {
	console.warn(
		'[commercetools] Missing required env vars; falling back to exampledata. Set USE_EXAMPLE_DATA=false and provide creds to enable commercetools.',
	);
}

if (!isMode && hasCredentials) {
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
	projectKey = projectKey || 'example';
	console.warn('[commercetools] Examplemode enabled; using exampledata.');
}

export { apiRoot, projectKey as CTP_PROJECT_KEY, isMode };
