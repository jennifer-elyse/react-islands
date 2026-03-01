// models/validate.js

import { z } from 'zod';

const isValidationEnabled = () => {
	return process.env.EDGE_VALIDATE === 'true';
};

const parseEdge = (schema, data, { label = 'edge' } = {}) => {
	if (!isValidationEnabled()) {
		return data;
	}

	const result = schema.safeParse(data);

	if (result.success) {
		return result.data;
	}

	const message = `Zod validation failed at ${label}`;
	const error = new Error(message);

	error.cause = result.error;

	console.error(message, result.error.format());

	throw error;
};

export { z, parseEdge, isValidationEnabled };
