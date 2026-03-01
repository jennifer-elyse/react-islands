import assert from 'node:assert/strict';
import test from 'node:test';

import { createSecurityEventHandler } from '../security.js';

test('createSecurityEventHandler accepts events and responds 204', () => {
	const logs = [];
	const handler = createSecurityEventHandler({
		logger: (...args) => logs.push(args),
	});

	let statusCode = 0;
	let ended = false;
	const res = {
		status: (code) => {
			statusCode = code;
			return res;
		},
		json: () => {
			ended = true;
		},
		end: () => {
			ended = true;
		},
	};

	handler(
		{
			body: { event: 'manifest_integrity_failed', detail: { foo: 'bar' } },
			path: '/',
		},
		res,
	);

	assert.equal(statusCode, 204);
	assert.ok(ended);
	assert.ok(logs.length === 1);
});
