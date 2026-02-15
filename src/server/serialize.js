export const serializePropsForAttr = (value) => {
	const json = JSON.stringify(value ?? null);

	// Escape characters that could break out of an HTML attribute or enable injection.
	return json
		.replaceAll("&", "\\u0026")
		.replaceAll("<", "\\u003c")
		.replaceAll(">", "\\u003e")
		.replaceAll('"', "\\u0022")
		.replaceAll("'", "\\u0027");
};

export const escapeJsonForInlineScript = (json) => {
	// Prevent </script> and friends from being interpreted.
	return json
		.replaceAll("&", "\\u0026")
		.replaceAll("<", "\\u003c")
		.replaceAll(">", "\\u003e");
};
