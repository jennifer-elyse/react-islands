import assert from "node:assert/strict";
import test from "node:test";

import { cspMiddleware, createSecurityEventHandler } from "../security.js";

test("cspMiddleware sets strict headers and dev origins", () => {
	let headerMap = {};
	const req = {};
	const res = {
		setHeader: (k, v) => { headerMap[k] = v; },
	};
	let calledNext = false;
	const next = () => { calledNext = true; };

	process.env.NODE_ENV = "development";
	process.env.ASSETS_ORIGIN = "http://localhost:5173";

	cspMiddleware()(req, res, next);

	assert.ok(headerMap["Content-Security-Policy"]?.includes("default-src 'self'"));
	assert.ok(headerMap["Content-Security-Policy"]?.includes("http://localhost:5173"));
	assert.equal(headerMap["X-Frame-Options"], "DENY");
	assert.ok(calledNext);
});

test("createSecurityEventHandler accepts events and responds 204", () => {
	const logs = [];
	const handler = createSecurityEventHandler({ logger: (...args) => logs.push(args) });

	let statusCode = 0;
	let ended = false;
	const res = {
		status: (code) => { statusCode = code; return res; },
		json: () => { ended = true; },
		end: () => { ended = true; },
	};

	handler({ body: { event: "manifest_integrity_failed", detail: { foo: "bar" } }, path: "/" }, res);

	assert.equal(statusCode, 204);
	assert.ok(ended);
	assert.ok(logs.length === 1);
});
