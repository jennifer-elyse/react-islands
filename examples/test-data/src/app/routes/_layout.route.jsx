import React from 'react';
import { ThemeModeSwitch } from 'react-islands-ui';
import { demoComponentDesignSystem } from '../../../server/designSystem.js';

export const loader = async () => ({ siteName: 'test-data' });

export const head = (props) => ({ title: props.siteName });

export const Layout = ({ children, siteName }) => {
	return (
		<div className="shell">
			<header className="shell__header">
				<div className="shell__brand">
					<span className="shell__eyebrow">Beachy Test Data Playground</span>
					<strong className="shell__name">{siteName}</strong>
				</div>
				<nav className="shell__nav">
					<a href="/">Home</a>
					<a href="/products">Products</a>
				</nav>
				<div className="shell__actions">
					<ThemeModeSwitch includeAuto={true} designSystem={demoComponentDesignSystem} />
				</div>
			</header>

			<div className="shell__main">{children}</div>

			<footer className="shell__footer">© {new Date().getFullYear()}</footer>
		</div>
	);
};
