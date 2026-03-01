import React from 'react';

export const Layout = ({ children }) => {
	return (
		<div>
			<nav style={{ marginBottom: 16, opacity: 0.8 }}>
				<a href="/" style={{ marginRight: 12 }}>
					Home
				</a>
				<a href="/product/1001">Example Product</a>
			</nav>

			{children}
		</div>
	);
};
