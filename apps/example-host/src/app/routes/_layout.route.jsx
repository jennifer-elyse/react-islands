import React from "react";

export const Layout = ({ children }) => {
	return (
		<div style={{ fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif", padding: 16 }}>
			<header style={{ marginBottom: 16 }}>
				<nav style={{ display: "flex", gap: 12 }}>
					<a href="/">Home</a>
					<a href="/product/123">Product</a>
				</nav>
			</header>
			{children}
			<footer style={{ marginTop: 24, opacity: 0.7 }}>
				<small>react-islands example-host</small>
			</footer>
		</div>
	);
};

export const head = () => {
	return {
		title: "react-islands example",
	};
};
