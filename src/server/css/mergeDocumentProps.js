// @ts-check

/**
 * @typedef {import('../../../types/ssr/index.d.ts').DocumentProps} DocumentProps
 */

const mergeAttrs = (base, next) => ({ ...(base || {}), ...(next || {}) });

const mergeArrays = (base, next) => [...(base || []), ...(next || [])];

/**
 * @param {DocumentProps | undefined} base
 * @param {DocumentProps | undefined} next
 * @returns {DocumentProps}
 */
export const mergeDocumentProps = (base = {}, next = {}) => ({
	htmlAttrs: mergeAttrs(base.htmlAttrs, next.htmlAttrs),
	bodyAttrs: mergeAttrs(base.bodyAttrs, next.bodyAttrs),
	meta: mergeArrays(base.meta, next.meta),
	links: mergeArrays(base.links, next.links),
	styles: mergeArrays(base.styles, next.styles),
	headPrefix: mergeArrays(base.headPrefix, next.headPrefix),
	headSuffix: mergeArrays(base.headSuffix, next.headSuffix),
});
