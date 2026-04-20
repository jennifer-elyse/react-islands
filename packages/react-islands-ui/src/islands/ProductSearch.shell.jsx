import React from 'react';

export const ProductSearchShell = ({
	placeholder,
	value = '',
	action = '/products',
	method = 'get',
	inputName = 'q',
	rootProps = {},
	onChange,
	onKeyDown,
	onFocus,
	onSubmit,
	inputRef,
	autoFocus = false,
	showSpinner = false,
	ariaExpanded = false,
	children,
}) => {
	const isControlled = typeof onChange === 'function';

	return (
		<>
			<div className="search-island__root" {...rootProps}>
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
		</>
	);
};
