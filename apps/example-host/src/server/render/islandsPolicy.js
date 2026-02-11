// This is your server-side allowlist.
// In a CMS integration, islandKey would come from CMS.
// The server translates that key to a module specifier that is later resolved via the manifest.

const ISLANDS = {
	add_to_cart: "/src/client/islands/AddToCartButton.entry.jsx",
	filters: "/src/client/islands/Filters.entry.jsx",
};

export const resolveIslandModule = (islandKey) => {
	return ISLANDS[islandKey] || null;
};

export const getAllIslandModuleSpecifiers = () => {
	return Object.values(ISLANDS);
};
