// models/customerModel.js

import { apiRoot } from './commercetools.client.js';

import { parseEdge, z } from './validate.js';

// Customer schema for validation
const customerSchema = z.object({
	id: z.string(),
	version: z.number(),
	email: z.string(),
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	externalId: z.string().optional(),
	customerNumber: z.string().optional(),
});

/**
 * Find customer by external ID (IdP subject)
 */
const findCustomerByExternalId = async (externalId) => {
	try {
		const response = await apiRoot
			.customers()
			.get({
				queryArgs: {
					where: `externalId="${externalId}"`,
					limit: 1,
				},
			})
			.execute();

		if (response.body.results && response.body.results.length > 0) {
			return parseEdge(customerSchema, response.body.results[0], {
				label: 'ct.customers.byExternalId',
			});
		}

		return null;
	} catch (err) {
		console.error('Error finding customer by externalId:', err);
		return null;
	}
};

/**
 * Find customer by email
 */
const findCustomerByEmail = async (email) => {
	try {
		const response = await apiRoot
			.customers()
			.get({
				queryArgs: {
					where: `lowercaseEmail="${email.toLowerCase()}"`,
					limit: 1,
				},
			})
			.execute();

		if (response.body.results && response.body.results.length > 0) {
			return parseEdge(customerSchema, response.body.results[0], {
				label: 'ct.customers.byEmail',
			});
		}

		return null;
	} catch (err) {
		console.error('Error finding customer by email:', err);
		return null;
	}
};

/**
 * Get customer by ID
 */
const getCustomerById = async (customerId) => {
	try {
		const response = await apiRoot.customers().withId({ ID: customerId }).get().execute();

		return parseEdge(customerSchema, response.body, { label: 'ct.customers.byId' });
	} catch (err) {
		if (err.statusCode === 404) {
			return null;
		}
		throw err;
	}
};

/**
 * Create a new customer from IdP claims
 */
const createCustomerFromIdp = async ({ externalId, email, firstName, lastName } = {}) => {
	try {
		const draft = {
			email,
			externalId,
			firstName: firstName || '',
			lastName: lastName || '',
			// Generate a random password since we won't use CT authentication
			password: crypto.randomUUID(),
			isEmailVerified: true,
		};

		const response = await apiRoot.customers().post({ body: draft }).execute();

		// The response includes the customer under 'customer' key
		return parseEdge(customerSchema, response.body.customer, { label: 'ct.customers.create' });
	} catch (err) {
		// If email already exists, try to find and update with externalId
		if (err.statusCode === 400 && err.body?.errors?.[0]?.code === 'DuplicateField') {
			const existing = await findCustomerByEmail(email);
			if (existing && !existing.externalId) {
				// Update existing customer with externalId
				return await updateCustomerExternalId(existing.id, existing.version, externalId);
			}
			return existing;
		}
		throw err;
	}
};

/**
 * Update customer's external ID
 */
const updateCustomerExternalId = async (customerId, version, externalId) => {
	try {
		const response = await apiRoot
			.customers()
			.withId({ ID: customerId })
			.post({
				body: {
					version,
					actions: [
						{
							action: 'setExternalId',
							externalId,
						},
					],
				},
			})
			.execute();

		return parseEdge(customerSchema, response.body, { label: 'ct.customers.setExternalId' });
	} catch (err) {
		console.error('Error updating customer externalId:', err);
		throw err;
	}
};

/**
 * Find or create customer from IdP claims
 * This is the main function used after SSO callback
 */
const findOrCreateCustomer = async ({ sub, email, givenName, familyName } = {}) => {
	// 1. Try to find by externalId (IdP subject)
	let customer = await findCustomerByExternalId(sub);

	if (customer) {
		return customer;
	}

	// 2. Try to find by email
	customer = await findCustomerByEmail(email);

	if (customer) {
		// Update with externalId if not set
		if (!customer.externalId) {
			customer = await updateCustomerExternalId(customer.id, customer.version, sub);
		}
		return customer;
	}

	// 3. Create new customer
	customer = await createCustomerFromIdp({
		externalId: sub,
		email,
		firstName: givenName,
		lastName: familyName,
	});

	return customer;
};

export { findCustomerByExternalId, findCustomerByEmail, getCustomerById, createCustomerFromIdp, findOrCreateCustomer };
