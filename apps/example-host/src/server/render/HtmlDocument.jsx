import React from "react";

export const HtmlDocument = ({ head, children, manifestJson, runtimeSrc, preloadHrefs = [] }) => {
	const title = head?.title || "Example Host";
	const meta = head?.meta || [];
	const links = head?.links || [];

	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<title>{title}</title>

				{meta.map((m, i) => <meta key={i} {...m} />)}
				{links.map((l, i) => <link key={i} {...l} />)}

				{preloadHrefs.map((href) => (
					<link key={href} rel="modulepreload" href={href} />
				))}

				<script
					id="islands-manifest"
					type="application/json"
					dangerouslySetInnerHTML={{ __html: manifestJson }}
				/>

				<script type="module" src={runtimeSrc} />
			</head>
			<body>
				<div id="app">{children}</div>
			</body>
		</html>
	);
};
