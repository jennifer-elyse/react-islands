import React from 'react';

export const loader = async () => ({ siteName: 'commercetools-demo' });

export const head = (props) => ({ title: props.siteName });

export const Layout = ({ children, siteName }) => {
	return (
		<div style={{ fontFamily: 'system-ui' }}>
			<header style={{ padding: 16, borderBottom: '1px solid #eee' }}>
				<strong>{siteName}</strong>
				<span style={{ marginLeft: 12, opacity: 0.7 }}>
					<a href="/" style={{ marginRight: 12 }}>
						Home
					</a>
					<a href="/products">Products</a>
				</span>
			</header>

			<div style={{ maxWidth: 900, margin: '24px auto', padding: '0 16px' }}>{children}</div>

			<footer style={{ padding: 16, borderTop: '1px solid #eee', opacity: 0.7 }}>
				© {new Date().getFullYear()}
			</footer>
		</div>
	);
};
