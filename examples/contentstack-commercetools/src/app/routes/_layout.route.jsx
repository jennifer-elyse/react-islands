import React from 'react';
import { ProductSearchSSR, ThemeModeSwitch } from 'react-islands';
import { demoComponentDesignSystem } from '../../../server/designSystem.js';

<<<<<<< Updated upstream
export const loader = async () => ({ siteName: 'contentstack+commercetools' });
=======
export const loader = async () => ({ siteName: 'D&W Fresh Market' });
>>>>>>> Stashed changes

export const head = (props) => ({ title: props.siteName });

const subnavLinks = [
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
<<<<<<< Updated upstream
		<div className="shell">
			<header className="shell__header">
				<div className="dw-header__utility">
					<a className="dw-header__pickup" href="/products">
						<span className="dw-header__pickup-icon" aria-hidden="true">
							+
						</span>
						<span>Pick Up at D&amp;W Fresh Market Downtown</span>
					</a>
					<div className="dw-header__search">
						<ProductSearchSSR
							placeholder="Search or ask a question"
							searchPageUrl="/products"
							autoFocus={false}
							designSystem={demoComponentDesignSystem}
						/>
					</div>
					<a className="dw-header__account" href="/products">
						Sign Up Or Log In
					</a>
				</div>

				<div className="dw-header__main">
					<a className="dw-header__logo" href="/" aria-label={siteName}>
						<span className="dw-header__logo-mark">
							D<span>&amp;</span>W
						</span>
						<span className="dw-header__logo-copy">Fresh Market</span>
					</a>

					<nav className="dw-header__nav" aria-label="Primary">
						{primaryLinks.map((label) => (
							<a key={label} href="/products">
								{label}
							</a>
						))}
					</nav>

					<div className="dw-header__actions">
						<a className="dw-header__cart" href="/products">
							<span>Cart</span>
							<strong>3</strong>
						</a>
						<div className="dw-header__theme">
							<ThemeModeSwitch designSystem={demoComponentDesignSystem} />
						</div>
					</div>
				</div>

				<nav className="dw-header__subnav" aria-label="Promotions">
					{promoLinks.map((label) => (
						<a key={label} href="/products">
							{label}
						</a>
=======
		<div className="app-shell">
			<header className="app-shell__header">
				{/* Utility bar */}
				<div className="dw-header__utility">
					<a className="dw-header__pickup" href="/store">
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
						Pick Up at D&amp;W Fresh Market Downtown
					</a>
					<div className="dw-header__search">
						<input type="search" placeholder="Search or ask a question" aria-label="Search" />
						<button type="submit" aria-label="Search">
							<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
						</button>
					</div>
					<a className="dw-header__auth" href="/account">Sign Up Or Log In</a>
				</div>

				{/* Main header: logo + nav + cart */}
				<div className="dw-header__main">
					<a className="dw-header__logo" href="/">
						<strong>D&amp;W</strong>
						<span>Fresh Market</span>
					</a>
					<nav className="dw-header__nav">
						<a href="/products">Shop</a>
						<a href="/weekly-ad">Weekly Ad</a>
						<a href="/savings">Savings</a>
						<a href="/meal-solutions">Meal Solutions</a>
						<a href="/entertaining">Entertaining</a>
						<a href="/pharmacy">Pharmacy</a>
					</nav>
					<a className="dw-header__cart" href="/cart">
						Cart <span className="dw-header__cart-count">3</span>
					</a>
				</div>

				{/* Subnav */}
				<nav className="dw-header__subnav">
					{subnavLinks.map((label) => (
						<a key={label} href={`/${label.toLowerCase().replace(/\s+/g, '-')}`}>{label}</a>
>>>>>>> Stashed changes
					))}
				</nav>
			</header>

			<div className="shell__main">{children}</div>

<<<<<<< Updated upstream
			<footer className="shell__footer">© {new Date().getFullYear()}</footer>
=======
			<footer className="app-shell__footer">© {new Date().getFullYear()} {siteName}</footer>
>>>>>>> Stashed changes
		</div>
	);
};
