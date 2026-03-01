import React from 'react';

const styles = {
	form: {
		width: '100%',
	},
	wrapper: {
		display: 'flex',
		alignItems: 'center',
		gap: 8,
		border: '1px solid #ddd',
		borderRadius: 8,
		padding: 6,
		background: '#fff',
	},
	input: {
		flex: 1,
		border: 'none',
		outline: 'none',
		padding: '8px 10px',
		fontSize: 16,
		background: 'transparent',
	},
	button: {
		display: 'inline-flex',
		alignItems: 'center',
		justifyContent: 'center',
		width: 44,
		height: 44,
		borderRadius: 6,
		border: '1px solid #0b5',
		background: '#0b5',
		color: '#fff',
		cursor: 'pointer',
	},
};

export const ProductSearchShell = ({
	placeholder,
	value = '',
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

	return (
		<>
			<div className="search-island__root" style={styles.form}>
				<form onSubmit={onSubmit} className="search-island" role="search">
					<div className="search-island__input-wrapper" style={styles.wrapper}>
						<input
							ref={inputRef}
							type="search"
							value={isControlled ? value : undefined}
							defaultValue={!isControlled ? value : undefined}
							onChange={onChange}
							onKeyDown={onKeyDown}
							onFocus={onFocus}
							placeholder={placeholder}
							className="search-island__input"
							autoComplete="off"
							aria-label="Search products"
							aria-expanded={ariaExpanded}
							style={styles.input}
						/>
						{showSpinner && <span className="search-island__spinner" />}
						<button type="submit" className="search-island__btn" style={styles.button}>
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
				.search-island__root { position: relative; width: 100%; }
				.search-island__input-wrapper { display: flex; align-items: center; background: #fff; border: 1px solid #dee2e6; border-radius: 8px; transition: border-color 0.2s, box-shadow 0.2s; }
				.search-island__input-wrapper:focus-within { border-color: #2d6a4f; box-shadow: 0 0 0 3px rgba(45,106,79,0.15); }
				.search-island__input { flex: 1; padding: 10px 16px; border: none; background: transparent; font-size: 1rem; outline: none; }
				.search-island__spinner { width: 18px; height: 18px; border: 2px solid #dee2e6; border-top-color: #2d6a4f; border-radius: 50%; animation: spin 0.8s linear infinite; margin-right: 8px; }
				@keyframes spin { to { transform: rotate(360deg); } }
				.search-island__btn { display: flex; align-items: center; justify-content: center; padding: 10px 14px; background: #2d6a4f; color: white; border: none; border-radius: 0 7px 7px 0; cursor: pointer; }
				.search-island__btn svg { width: 22px; height: 22px; }
				.search-island__btn:hover { background: #1b4332; }
				.search-island__dropdown { position: absolute; top: calc(100% + 4px); left: 0; right: 0; background: white; border: 1px solid #dee2e6; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); max-height: 420px; overflow-y: auto; z-index: 1000; }
				.search-island__tabs { display: flex; border-bottom: 1px solid #dee2e6; }
				.search-island__tab { flex: 1; padding: 10px; background: none; border: none; font-size: 0.875rem; color: #6c757d; cursor: pointer; }
				.search-island__tab:hover { background: #f8f9fa; }
				.search-island__tab--active { color: #2d6a4f; font-weight: 600; box-shadow: inset 0 -2px 0 #2d6a4f; }
				.search-island__list { list-style: none; padding: 0; margin: 0; }
				.search-island__item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; cursor: pointer; }
				.search-island__item:hover, .search-island__item--selected { background: #f8f9fa; }
				.search-island__item-img { width: 44px; height: 44px; object-fit: cover; border-radius: 6px; background: #f8f9fa; }
				.search-island__item-content { flex: 1; display: flex; flex-direction: column; }
				.search-island__item-text { font-weight: 500; }
				.search-island__item-badge { display: inline-block; padding: 2px 6px; font-size: 0.7rem; font-weight: 600; color: #6c757d; background: #e9ecef; border-radius: 4px; margin-top: 2px; width: fit-content; }
				.search-island__item-price { font-size: 0.875rem; font-weight: 600; color: #2d6a4f; margin-top: 2px; }
				.search-island__item-icon { color: #6c757d; flex-shrink: 0; }
				.search-island__recent-header { display: flex; justify-content: space-between; align-items: center; padding: 10px 16px; font-size: 0.75rem; font-weight: 600; color: #6c757d; text-transform: uppercase; border-bottom: 1px solid #f1f3f4; }
				.search-island__clear-btn { background: none; border: none; font-size: 0.75rem; color: #dc3545; cursor: pointer; text-transform: none; }
				.search-island__clear-btn:hover { text-decoration: underline; }
				.search-island__empty { padding: 24px 16px; text-align: center; color: #6c757d; }
				.search-highlight { background: #fff3cd; padding: 0 1px; border-radius: 2px; }
			`}</style>
		</>
	);
};
