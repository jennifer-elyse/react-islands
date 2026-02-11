import React from "react";

export const Layout = ({ children }) => {
	return (
		<div style={{ border: "1px solid #eee", padding: 16, borderRadius: 12 }}>
			<h1 style={{ marginTop: 0 }}>Product Area Layout</h1>
			{children}
		</div>
	);
};
