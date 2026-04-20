export function escapeJsonForInlineScript(json) {
	return json
		.replace(/</g, '\\u003c')
		.replace(/>/g, '\\u003e')
		.replace(/&/g, '\\u0026')
		.replace(/\u2028/g, '\\u2028')
		.replace(/\u2029/g, '\\u2029');
}

export function serializePropsForAttr(props) {
	// Use a safe JSON serializer for embedding in HTML attributes.
	return escapeJsonForInlineScript(JSON.stringify(props ?? {}));
}
