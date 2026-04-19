import contentstack from 'contentstack';

const required = (name) => {
	const v = process.env[name];
	if (!v) throw new Error(`Missing required env var: ${name}`);
	return v;
};

const getCmsConfig = () => {
	const apiKey = required('CONTENTSTACK_API_KEY');
	const deliveryToken = required('CONTENTSTACK_DELIVERY_TOKEN');
	const environment = required('CONTENTSTACK_ENVIRONMENT');
	const cdnHost = process.env.CONTENTSTACK_CDN_HOST;
	const region = process.env.CONTENTSTACK_REGION;

	return { apiKey, deliveryToken, environment, cdnHost, region };
};

let cmsStack = null;

/**
 * Resolves the CMS region string from environment variable to the corresponding SDK constant.
 * @author Anudeep Thummalapalli
 * @version 1.0
 * @param {*} region
 * @returns The resolved region constant for the CMS SDK, or undefined if not set or invalid.
 */
const resolveCmsRegion = (region) => {
	if (!region) return undefined;

	const value = String(region).trim().toLowerCase();
	const regionMap = {
		us: contentstack.Region.US,
		eu: contentstack.Region.EU,
		au: contentstack.Region.AU,
		'azure-na': contentstack.Region.AZURE_NA,
		'azure-eu': contentstack.Region.AZURE_EU,
		'gcp-na': contentstack.Region.GCP_NA,
		'gcp-eu': contentstack.Region.GCP_EU,
	};

	return regionMap[value];
};

/**
 * Retrieves the CMS SDK stack instance for server-side CMS client operations.
 * @author Anudeep Thummalapalli
 * @version 1.0
 * @returns {Object} The CMS SDK stack object containing configuration and methods for CMS interactions.
 */
const getCmsSdkStack = () => {
	const { apiKey, deliveryToken, environment, region } = getCmsConfig();
	const sdkRegion = resolveCmsRegion(region);

	// Reuse one SDK stack instance per process to avoid recreating it for every request.
	if (!cmsStack) {
		if (region && !sdkRegion) {
			console.warn('[Content-Stack] Invalid CONTENTSTACK_REGION value', {
				region,
				allowedValues: ['us', 'eu', 'au', 'azure-na', 'azure-eu', 'gcp-na', 'gcp-eu'],
			});
		}

		cmsStack = contentstack.Stack({
			api_key: apiKey,
			delivery_token: deliveryToken,
			environment,
			region: sdkRegion,
		});
	}
	return cmsStack;
};

/**
 * Normalizes errors thrown by the CMS SDK into a consistent format for logging and diagnostics.
 * @author Anudeep Thummalapalli
 * @version 1.0
 * @param {*} error
 * @returns {Object} An object containing normalized error information, including message, code, status, and name.
 */
const normalizeCmsError = (error) => {
	// Contentstack SDK can throw plain objects; normalize into readable fields.
	if (error instanceof Error) {
		return {
			message: error.message,
			code: error.code || null,
			status: error.status || error.statusCode || null,
			name: error.name || 'Error',
		};
	}

	if (error && typeof error === 'object') {
		const errObj = error;
		const nestedMessage = errObj.error_message || errObj.message || errObj.notice || errObj.error || null;
		return {
			message: nestedMessage || 'Unknown CMS SDK error object',
			code: errObj.error_code || errObj.code || null,
			status: errObj.status || errObj.statusCode || null,
			name: errObj.name || 'ContentstackError',
			// Keep raw object for diagnostics when message/code are insufficient.
			raw: errObj,
		};
	}
	return {
		message: String(error),
		code: null,
		status: null,
		name: 'UnknownError',
	};
};

/**
 * Verifies the connection to the CMS by performing a lightweight query using the SDK.
 * This checks for valid credentials, environment access, and API reachability.
 * @author Anudeep Thummalapalli
 * @version 1.0
 */
export const verifyCmsConnection = async () => {
	const startedAt = Date.now();
	const checkContext = {
		contentType: 'page',
		environment: process.env.CONTENTSTACK_ENVIRONMENT || null,
	};

	console.info('[Content-Stack], CMS connection check: STARTED', checkContext);

	try {
		const stack = getCmsSdkStack();

		// Run a lightweight SDK query to validate credentials, environment access, and API reachability.
		await stack.ContentType('page').Query().toJSON().find();

		const durationMs = Date.now() - startedAt;
		console.info('[Content-Stack], CMS connection check: SUCCESS: %j', {
			...checkContext,
			durationMs,
		});
		return { ok: true, durationMs };
	} catch (error) {
		const normalized = normalizeCmsError(error);
		const durationMs = Date.now() - startedAt;
		console.warn('[Content-Stack], CMS connection check: FAILED', {
			...checkContext,
			durationMs,
			message: normalized.message,
			name: normalized.name || null,
			code: normalized.code || null,
			status: normalized.status || null,
			raw: normalized.raw || null,
		});
		return {
			ok: false,
			error: normalized.message,
			errorInfo: normalized,
			durationMs,
		};
	}
};

/**
 * Creates and returns a CMS client object with methods for interacting with the CMS, such as fetching page data by slug.
 * @author Anudeep Thummalapalli
 * @version 1.0
 * @returns {Object} The CMS client object with stack and page fetching methods.
 */
export const createCmsClient = () => {
	// Retrieving the CMS SDK stack is synchronous because the instance is cached after first creation.
	const stack = getCmsSdkStack();

	return {
		stack,
		getPageBySlug: async ({ slug }) => {
			const query = stack.ContentType('page').Query();
			const queryResult = await query.where('slug', slug).toJSON().find();
			// SDK returns [entries, ...metadata], so entries are in index 0.
			const entries = Array.isArray(queryResult) ? queryResult[0] || [] : [];
			const pageEntry = entries[0];
			return {
				slug,
				// Keep route data shape unchanged for existing rendering.
				title: pageEntry?.title || 'Home',
				blocks: pageEntry?.blocks || [
					{
						type: 'hero',
						title: 'Weekly Deals',
						subtitle: 'SSR-first content',
					},
					{
						type: 'product_search',
						islandKey: 'product_search',
						hydrate: 'interaction',
					},
					{ type: 'cart_mini', islandKey: 'cart', hydrate: 'visible' },
				],
			};
		},
	};
};
