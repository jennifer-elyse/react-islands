import React from 'react';
import { ThemeModeSwitch } from '../../../../_shared/components/ThemeModeSwitch.jsx';

export const loader = async () => ({ siteName: 'commercetools-demo' });

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
				<div className="demo-shell__actions">
					<ThemeModeSwitch />
				</div>
			</header>

			<div className="demo-shell__main">{children}</div>

			<footer className="demo-shell__footer">
				© {new Date().getFullYear()}
			</footer>
		</div>
	);
};
