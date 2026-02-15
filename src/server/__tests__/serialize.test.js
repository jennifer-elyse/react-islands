import assert from "node:assert/strict";
import test from "node:test";

import { escapeJsonForInlineScript, serializePropsForAttr } from "../serialize.js";

// The attribute payload should survive a round-trip through HTML and JSON.parse
// while protecting against obvious HTML/script breakouts.
test("serializePropsForAttr escapes HTML breakers", () => {
	const props = { a: "</script><img src=x onerror=alert(1)>", count: 1 };
	const serialized = serializePropsForAttr(props);

	// Should be safe to embed in HTML attributes
	assert.ok(!serialized.includes("</script>"));
	assert.ok(!serialized.includes("<img"));

	const roundTrip = JSON.parse(serialized);
	assert.deepEqual(roundTrip, props);
});

// The manifest JSON is inlined inside a <script type="application/json"> tag.
// Ensure common breakers are escaped.
test("escapeJsonForInlineScript escapes script breakers", () => {
	const json = JSON.stringify({ tag: "</script> & <div>" });
	const escaped = escapeJsonForInlineScript(json);

	assert.ok(!escaped.includes("</script>"));
	assert.ok(escaped.includes("\\u003c"));

	const parsed = JSON.parse(escaped);
	assert.deepEqual(parsed, { tag: "</script> & <div>" });
});
