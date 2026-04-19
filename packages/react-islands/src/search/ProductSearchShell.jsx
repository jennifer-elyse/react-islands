import React from 'react';
import { resolveComponentDesignSystem } from '../designSystem/resolveComponentDesignSystem.js';

const styles = {
	form: {
		width: '100%',
	},
};

export const ProductSearchShell = ({
	placeholder,
	value = '',
	action = '/products',
	method = 'get',
	inputName = 'q',
	autoFocus = true,
	rootProps = {},
	designSystem,
	onChange,
	onKeyDown,
	onFocus,
	onSubmit,
	inputRef,
	showSpinner = false,
	ariaExpanded = false,
	children,
}) => {
	const isControlled = typeof onChange === 'function';
	const rootDesign = resolveComponentDesignSystem({
		componentName: 'productSearch',
		designSystem,
		className: rootProps?.className,
		style: rootProps?.style,
		defaultClassName: 'search-island__root',
	});
	const mergedRootProps = {
		...rootProps,
		...rootDesign.attrs,
		className: rootDesign.className,
		style: { ...styles.form, ...(rootDesign.style || {}) },
	};

	return (
		<>
			<div {...mergedRootProps}>
				<form action={action} method={method} onSubmit={onSubmit} className="search-island" role="search">
					<div className="search-island__input-wrapper">
						<input
							ref={inputRef}
							type="search"
							name={inputName}
							value={isControlled ? value : undefined}
							defaultValue={!isControlled ? value : undefined}
							onChange={onChange}
							onKeyDown={onKeyDown}
							onFocus={onFocus}
							placeholder={placeholder}
							className="search-island__input"
							autoComplete="off"
							autoFocus={autoFocus}
							aria-label="Search products"
							aria-expanded={ariaExpanded}
						/>
						{showSpinner && <span className="search-island__spinner" />}
						<button type="submit" className="search-island__btn">
							<svg
								width="22"
								height="22"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
							>
								<circle cx="11" cy="11" r="8" />
								<path d="m21 21-4.35-4.35" />
							</svg>
						</button>
					</div>
				</form>
				<div className="search-island__dropdown-shell" suppressHydrationWarning>
					{children || null}
				</div>
			</div>
			<style>{`
				.search-island__root {
					position: relative;
					width: 100%;
					--search-surface-bg: var(--surface-panel, #fff);
					--search-surface-border: var(--border-subtle, #dee2e6);
					--search-surface-radius: var(--radius-card, 8px);
					--search-surface-padding: 6px;
					--search-focus-ring: color-mix(in srgb, var(--surface-accent, #2d6a4f) 18%, transparent);
					--search-focus-border: var(--surface-accent, #2d6a4f);
					--search-input-padding-block: 10px;
					--search-input-padding-inline: 16px;
					--search-input-font-size: 1rem;
					--search-input-font-family: var(--font-ui, inherit);
					--search-input-color: var(--text-primary, inherit);
					--search-placeholder-color: color-mix(in srgb, var(--text-muted, #6c757d) 84%, white);
					--search-button-size: 48px;
					--search-button-radius: calc(var(--search-surface-radius) - 2px);
					--search-button-bg: var(--surface-accent, #2d6a4f);
					--search-button-bg-hover: color-mix(in srgb, var(--search-button-bg) 82%, black);
					--search-button-text: white;
					--search-dropdown-radius: var(--search-surface-radius);
					--search-dropdown-shadow: 0 10px 26px color-mix(in srgb, var(--surface-shadow, black) 16%, transparent);
					--search-dropdown-offset: 6px;
					--search-dropdown-max-height: 420px;
					--search-tab-font-size: 0.875rem;
					--search-item-gap: 12px;
					--search-item-padding-block: 12px;
					--search-item-padding-inline: 16px;
					--search-item-image-size: 44px;
					--search-item-image-radius: 6px;
					--search-badge-radius: 4px;
					--search-badge-bg: color-mix(in srgb, var(--surface-muted, #e9ecef) 88%, white);
					--search-badge-text: var(--text-muted, #6c757d);
					--search-highlight-bg: #fff3cd;
				}
				.search-island__input-wrapper {
					display: flex;
					align-items: center;
					gap: 8px;
					background: var(--search-surface-bg);
					border: 1px solid var(--search-surface-border);
					border-radius: var(--search-surface-radius);
					padding: var(--search-surface-padding);
					transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
				}
				.search-island__input-wrapper:focus-within {
					border-color: var(--search-focus-border);
					box-shadow: 0 0 0 3px var(--search-focus-ring);
				}
				.search-island__input {
					flex: 1;
					padding: var(--search-input-padding-block) var(--search-input-padding-inline);
					border: none;
					background: transparent;
					font-size: var(--search-input-font-size);
					font-family: var(--search-input-font-family);
					color: var(--search-input-color);
					outline: none;
				}
				.search-island__input::placeholder {
					color: var(--search-placeholder-color);
				}
				.search-island__spinner {
					width: 18px;
					height: 18px;
					border: 2px solid var(--search-surface-border);
					border-top-color: var(--search-focus-border);
					border-radius: 50%;
					animation: spin 0.8s linear infinite;
					margin-right: 8px;
				}
				@keyframes spin { to { transform: rotate(360deg); } }
				.search-island__btn {
					display: flex;
					align-items: center;
					justify-content: center;
					inline-size: var(--search-button-size);
					block-size: var(--search-button-size);
					padding: 0;
					background: var(--search-button-bg);
					color: var(--search-button-text);
					border: none;
					border-radius: var(--search-button-radius);
					cursor: pointer;
					transition: background 0.2s ease, transform 0.2s ease;
				}
				.search-island__btn svg { width: 22px; height: 22px; }
				.search-island__btn:hover { background: var(--search-button-bg-hover); transform: translateY(-1px); }
				.search-island__dropdown {
					position: absolute;
					top: calc(100% + var(--search-dropdown-offset));
					left: 0;
					right: 0;
					background: var(--search-surface-bg);
					border: 1px solid var(--search-surface-border);
					border-radius: var(--search-dropdown-radius);
					box-shadow: var(--search-dropdown-shadow);
					max-height: var(--search-dropdown-max-height);
					overflow-y: auto;
					z-index: 1000;
				}
				.search-island__tabs { display: flex; border-bottom: 1px solid var(--search-surface-border); }
				.search-island__tab {
					flex: 1;
					padding: 10px;
					background: none;
					border: none;
					font-size: var(--search-tab-font-size);
					font-family: var(--search-input-font-family);
					color: var(--text-muted, #6c757d);
					cursor: pointer;
				}
				.search-island__tab:hover { background: color-mix(in srgb, var(--surface-muted, #f8f9fa) 72%, white); }
				.search-island__tab--active { color: var(--search-focus-border); font-weight: 600; box-shadow: inset 0 -2px 0 var(--search-focus-border); }
				.search-island__list { list-style: none; padding: 0; margin: 0; }
				.search-island__item {
					display: flex;
					align-items: center;
					gap: var(--search-item-gap);
					padding: var(--search-item-padding-block) var(--search-item-padding-inline);
					cursor: pointer;
				}
				.search-island__item:hover, .search-island__item--selected { background: color-mix(in srgb, var(--surface-muted, #f8f9fa) 72%, white); }
				.search-island__item-img {
					width: var(--search-item-image-size);
					height: var(--search-item-image-size);
					object-fit: cover;
					border-radius: var(--search-item-image-radius);
					background: color-mix(in srgb, var(--surface-muted, #f8f9fa) 72%, white);
				}
				.search-island__item-content { flex: 1; display: flex; flex-direction: column; }
				.search-island__item-text { font-weight: 500; color: var(--text-primary, inherit); }
				.search-island__item-badge {
					display: inline-block;
					padding: 2px 6px;
					font-size: 0.7rem;
					font-weight: 600;
					color: var(--search-badge-text);
					background: var(--search-badge-bg);
					border-radius: var(--search-badge-radius);
					margin-top: 2px;
					width: fit-content;
				}
				.search-island__item-price { font-size: 0.875rem; font-weight: 600; color: var(--search-focus-border); margin-top: 2px; }
				.search-island__item-icon { color: var(--text-muted, #6c757d); flex-shrink: 0; }
				.search-island__recent-header {
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding: 10px 16px;
					font-size: 0.75rem;
					font-weight: 600;
					color: var(--text-muted, #6c757d);
					text-transform: uppercase;
					border-bottom: 1px solid color-mix(in srgb, var(--search-surface-border) 74%, white);
				}
				.search-island__clear-btn { background: none; border: none; font-size: 0.75rem; color: #dc3545; cursor: pointer; text-transform: none; }
				.search-island__clear-btn:hover { text-decoration: underline; }
				.search-island__empty { padding: 24px 16px; text-align: center; color: var(--text-muted, #6c757d); }
				.search-highlight { background: var(--search-highlight-bg); padding: 0 1px; border-radius: 2px; }
			`}</style>
		</>
	);
};

export default ProductSearchShell;
