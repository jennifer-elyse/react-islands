import React from 'react';

export const loader = async () => ({ siteName: 'contentstack-demo' });

export const head = (props) => ({ title: props.siteName });

export const Layout = ({ children, siteName }) => {
	return (
		<div className="demo-shell">
			<header className="demo-shell__header">
				<div className="demo-shell__brand">
					<span className="demo-shell__eyebrow">Integrated Design System</span>
					<strong className="demo-shell__name">{siteName}</strong>
				</div>
				<nav className="demo-shell__nav">
					<a href="/">
						Home
					</a>
					<a href="/products">Products</a>
				</nav>
			</header>

			<div className="demo-shell__main">{children}</div>

			<footer className="demo-shell__footer">
				© {new Date().getFullYear()}
			</footer>
		</div>
	);
};
