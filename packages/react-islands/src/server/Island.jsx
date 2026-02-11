import React from "react";
import { serializePropsForAttr } from "./serialize.js";

export const Island = ({
	islandKey,
	hydrate = "visible", // "idle" | "interaction" | "immediate"
	props,
	children,
	resolveIslandModule, // (islandKey) => moduleSpecifier|null
}) => {
	if (typeof resolveIslandModule !== "function")
	{
		throw new Error("Island requires resolveIslandModule(islandKey) to be provided.");
	}

	const moduleSpecifier = resolveIslandModule(islandKey);

	// No module = SSR-only. This is intentional for SEO.
	if (!moduleSpecifier)
	{
		return <>{children || null}</>;
	}

	const serialized = serializePropsForAttr(props);

	return (
		<div
			data-island-module={moduleSpecifier}
			data-hydrate={hydrate}
			data-props={serialized}
			suppressHydrationWarning={true}
		>
			{children || null}
		</div>
	);
};
