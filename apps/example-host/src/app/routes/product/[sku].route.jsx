import React from "react";
import { Island } from "@jennifer-elyse/react-islands/server";
import { resolveIslandModule } from "../../../server/render/islandsPolicy.js";

export const loader = async ({ params }) => {
	return {
		sku: params.sku,
		name: `Demo Product ${params.sku}`,
		price: "$4.99",
	};
};

export const head = (props) => {
	return {
		title: props.name,
		meta: [{ name: "description", content: `Product ${props.sku}` }],
	};
};

export const Page = ({ sku, name, price }) => {
	return (
		<article>
			<h2 style={{ marginTop: 0 }}>{name}</h2>
			<div>SKU: {sku}</div>
			<div>Price: {price}</div>

			<div style={{ marginTop: 16 }}>
				<Island
					islandKey="add_to_cart"
					hydrate="interaction"
					props={{ sku }}
					resolveIslandModule={resolveIslandModule}
				>
					<button type="button">Add to cart</button>
				</Island>
				<div style={{ marginTop: 8, opacity: 0.7 }}>
					The button above is SSR. It becomes interactive on first click/focus/keydown.
				</div>
			</div>
		</article>
	);
};
