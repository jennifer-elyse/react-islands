import React from "react";

export const HtmlDocument = ({ head, children, manifestJson, manifestIntegrity, runtimeSrc, pwaToastSrc, preloadHrefs = [] }) => {
	const title = head?.title || "React Islands";
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

				<link rel="manifest" href="/manifest.webmanifest" />
				<link rel="icon" href="/icons/islands.jpg" type="image/jpeg" />

				<script
					id="islands-manifest"
					type="application/json"
					data-integrity={manifestIntegrity || undefined}
					dangerouslySetInnerHTML={{ __html: manifestJson }}
				/>

				<script type="module" src={runtimeSrc} />
				{pwaToastSrc ? <script type="module" src={pwaToastSrc} /> : null}
			</head>
			<body>
				<div id="app">{children}</div>
			</body>
		</html>
	);
};
