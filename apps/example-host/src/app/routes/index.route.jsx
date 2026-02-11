import React from "react";
import { Island } from "@jennifer-elyse/react-islands/server";
import { resolveIslandModule } from "../../server/render/islandsPolicy.js";

export const loader = async () => {
	// Mock Contentstack-like blocks
	return {
		pageTitle: "CMS page (SSR-first)",
		blocks: [
			{ type: "rich_text", html: "<h1>SSR page</h1><p>This content is server-rendered for SEO.</p>" },
			{ type: "filters", islandKey: "filters", hydrate: "visible", props: { initialQuery: "" } },
		],
	};
};

export const head = (props) => {
	return {
		title: props.pageTitle,
		meta: [{ name: "description", content: "SSR-first page with lazy islands" }],
	};
};

const Block = ({ block }) => {
	if (block.type === "rich_text")
	{
		return (
			<section
				dangerouslySetInnerHTML={{ __html: block.html }}
			/>
		);
	}

	if (block.type === "filters")
	{
		// SSR markup (SEO + immediate paint). Client enhances later.
		return (
			<section style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8 }}>
				<h2>Filters (island)</h2>
				<Island
					islandKey={block.islandKey}
					hydrate={block.hydrate}
					props={block.props}
					resolveIslandModule={resolveIslandModule}
				>
					<div>
						<label><strong>Search</strong></label>
						<div>
							<input placeholder="Type to filter" disabled={true} />
						</div>
						<div style={{ marginTop: 8, opacity: 0.7 }}>
							SSR placeholder. Becomes interactive when visible.
						</div>
					</div>
				</Island>
			</section>
		);
	}

	return null;
};

export const Page = ({ blocks }) => {
	return (
		<main style={{ display: "grid", gap: 16 }}>
			{blocks.map((b, i) => (
				<Block key={i} block={b} />
			))}
		</main>
	);
};
