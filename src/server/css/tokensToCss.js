// @ts-check

/**
 * @typedef {string | number | boolean | null | undefined} TokenPrimitive
 * @typedef {Record<string, TokenPrimitive | TokenTree>} TokenTree
 */

const kebab = (value) =>
	String(value)
		.replace(/([a-z0-9])([A-Z])/g, '$1-$2')
		.replace(/[\s_]+/g, '-')
		.replace(/[^a-zA-Z0-9-]/g, '-')
		.replace(/-+/g, '-')
		.toLowerCase();

const appendEntries = (input, path, out) => {
	if (input == null) return;
	if (Array.isArray(input)) {
		for (let i = 0; i < input.length; i += 1) appendEntries(input[i], [...path, String(i)], out);
		return;
	}
	if (typeof input === 'object') {
		for (const [key, value] of Object.entries(input)) appendEntries(value, [...path, key], out);
		return;
	}
	out.push([path.map(kebab).join('-'), String(input)]);
};

/**
 * Flattens nested token objects into CSS custom properties.
 *
 * @param {Record<string, unknown>} tokens
 * @param {object} [opts]
 * @param {string} [opts.prefix='']
 * @returns {Record<string, string>}
 */
export const flattenTokensToCssVars = (tokens, { prefix = '' } = {}) => {
	const pairs = [];
	appendEntries(tokens, [], pairs);

	/** @type {Record<string, string>} */
	const vars = {};
	for (const [key, value] of pairs) {
		const full = prefix ? `--${kebab(prefix)}-${key}` : `--${key}`;
		vars[full] = value;
	}
	return vars;
};

/**
 * @param {Record<string, string>} vars
 * @returns {string}
 */
export const cssVarsToDeclarationBlock = (vars) =>
	Object.entries(vars)
		.map(([name, value]) => `${name}: ${value};`)
		.join('\n');

/**
 * @param {Record<string, unknown>} tokens
 * @param {object} [opts]
 * @param {string} [opts.selector=':root']
 * @param {string} [opts.prefix='']
 * @returns {string}
 */
export const tokensToCssText = (tokens, { selector = ':root', prefix = '' } = {}) => {
	const vars = flattenTokensToCssVars(tokens, { prefix });
	return `${selector} {\n${cssVarsToDeclarationBlock(vars)}\n}`;
};
