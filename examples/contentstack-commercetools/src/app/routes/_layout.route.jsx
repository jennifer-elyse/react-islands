import React from 'react';
import { ProductSearchSSR, ThemeModeSwitch } from 'react-islands-ui';
import { demoComponentDesignSystem } from '../../../server/designSystem.js';

export const loader = async () => ({ siteName: 'Contentstack + Commercetools' });

export const head = (props) => ({ title: props.siteName });

export const Layout = ({ children, siteName }) => {
	const primaryLinks = ['Shop', 'Weekly Ad', 'Savings', 'Meal Solutions', 'Entertaining', 'Pharmacy'];
	const promoLinks = [
		'Products',
		'Promotions',
		'Coupons',
		'Valentine Sale',
		'New Arrivals',
		'Loyalty Rewards',
		'Holiday Specials',
		'Buy One Get One Free',
		'National Brands',
	];

	return (
		<div className="app-shell">
			<header className="app-shell__header">
				<div className="dw-header__utility">
					<a className="dw-header__pickup" href="/products">
						<svg
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<circle cx="12" cy="12" r="10" />
							<line x1="12" y1="8" x2="12" y2="12" />
							<line x1="12" y1="16" x2="12.01" y2="16" />
						</svg>
						Connected catalog + content demo
					</a>
					<div className="dw-header__search">
						<ProductSearchSSR
							placeholder="Search or ask a question"
							searchPageUrl="/products"
							autoFocus
							designSystem={demoComponentDesignSystem}
						/>
					</div>
					<a className="dw-header__auth" href="/products">
						Sign Up Or Log In
					</a>
				</div>

				<div className="dw-header__main">
					<a className="dw-header__logo" href="/" aria-label={siteName}>
						<strong>CS</strong>
						<span>+ CT</span>
					</a>
					<nav className="dw-header__nav">
						{primaryLinks.map((label) => (
							<a key={label} href="/products">
								{label}
							</a>
						))}
					</nav>
					<div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
						<div className="dw-header__theme">
							<ThemeModeSwitch designSystem={demoComponentDesignSystem} />
						</div>
						<a className="dw-header__cart" href="/products">
							Cart <span className="dw-header__cart-count">3</span>
						</a>
					</div>
				</div>

				<nav className="dw-header__subnav">
					{promoLinks.map((label) => (
						<a key={label} href="/products">
							{label}
						</a>
					))}
				</nav>
			</header>

			<div className="shell__main">{children}</div>

			<footer className="app-shell__footer">
				© {new Date().getFullYear()} {siteName}
			</footer>
		</div>
	);
};
