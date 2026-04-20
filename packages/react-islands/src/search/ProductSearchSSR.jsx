import React from 'react';
import { ProductSearchShell } from './ProductSearchShell.jsx';

export const ProductSearchSSR = ({
	placeholder,
	searchPageUrl = '/products',
	queryName = 'q',
	value = '',
	autoFocus = true,
	endpoint = '/api/search/suggestions',
	minChars = 2,
	debounceMs = 180,
	maxSuggestions = 8,
	designSystem,
}) => {
	const enhanceScript = `(() => {
		if (window.__riProductSearchEnhanced) return;
		window.__riProductSearchEnhanced = true;

		const escapeHtml = (value) =>
			String(value ?? '')
				.replace(/&/g, '&amp;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;')
				.replace(/"/g, '&quot;')
				.replace(/'/g, '&#39;');

		const roots = Array.from(document.querySelectorAll('[data-search-enhanced="true"]'));
		for (const root of roots) {
			if (root.dataset.searchBound === 'true') continue;
			root.dataset.searchBound = 'true';

			const input = root.querySelector('.search-island__input');
			const shell = root.querySelector('.search-island__dropdown-shell');
			if (!input || !shell) continue;

			const endpoint = root.dataset.searchEndpoint || '/api/search/suggestions';
			const searchPageUrl = root.dataset.searchPageUrl || '/products';
			const minChars = Number(root.dataset.searchMinChars || '2');
			const maxSuggestions = Number(root.dataset.searchMaxSuggestions || '8');
			const debounceMs = Number(root.dataset.searchDebounceMs || '180');

			let debounceId = null;
			let abortController = null;

			const close = () => {
				shell.innerHTML = '';
				input.setAttribute('aria-expanded', 'false');
			};

			const renderSuggestions = (suggestions, query) => {
				if (!Array.isArray(suggestions) || suggestions.length === 0) {
					shell.innerHTML = '<div class="search-island__dropdown"><div class="search-island__empty">No products found for "' + escapeHtml(query) + '"</div></div>';
					input.setAttribute('aria-expanded', 'true');
					return;
				}

				const items = suggestions.slice(0, maxSuggestions).map((item) => {
					const text = escapeHtml(item?.text || item?.label || item?.query || '');
					const slug = encodeURIComponent(item?.slug || item?.sku || item?.id || text);
					const href = item?.type === 'product' && (item?.slug || item?.sku || item?.id)
						? '/products/' + slug
						: searchPageUrl + '?q=' + encodeURIComponent(item?.text || '');
					const image = item?.imageUrl
						? '<img src="' + escapeHtml(item.imageUrl) + '" alt="" class="search-island__item-img" loading="lazy" decoding="async" />'
						: '';
					const price = item?.price ? '<span class="search-island__item-price">' + escapeHtml(item.price) + '</span>' : '';

					return '<li><a class="search-island__item" href="' + href + '">' +
						image +
						'<span class="search-island__item-content">' +
							'<span class="search-island__item-text">' + text + '</span>' +
							price +
						'</span>' +
					'</a></li>';
				}).join('');

				shell.innerHTML = '<div class="search-island__dropdown"><ul class="search-island__list">' + items + '</ul></div>';
				input.setAttribute('aria-expanded', 'true');
			};

			const fetchSuggestions = async (query) => {
				if (query.length < minChars) {
					close();
					return;
				}

				if (abortController) abortController.abort();
				abortController = new AbortController();

				try {
					const params = new URLSearchParams({
						q: query,
						limit: String(maxSuggestions),
					});
					const response = await fetch(endpoint + '?' + params.toString(), {
						signal: abortController.signal,
						headers: { Accept: 'application/json' },
					});
					if (!response.ok) {
						close();
						return;
					}
					const payload = await response.json();
					renderSuggestions(payload?.suggestions || [], query);
				} catch (error) {
					if (error?.name !== 'AbortError') close();
				}
			};

			input.addEventListener('input', () => {
				const query = input.value.trim();
				window.clearTimeout(debounceId);
				debounceId = window.setTimeout(() => {
					void fetchSuggestions(query);
				}, debounceMs);
			});

			input.addEventListener('focus', () => {
				const query = input.value.trim();
				if (query.length >= minChars) {
					void fetchSuggestions(query);
				}
			});

			document.addEventListener('mousedown', (event) => {
				if (!root.contains(event.target)) close();
			});

			input.form?.addEventListener('submit', () => close());
		}
	})();`;

	return (
		<>
			<ProductSearchShell
				placeholder={placeholder}
				value={value}
				action={searchPageUrl}
				method="get"
				inputName={queryName}
				autoFocus={autoFocus}
				designSystem={designSystem}
				ariaExpanded={false}
				rootProps={{
					'data-search-enhanced': 'true',
					'data-search-endpoint': endpoint,
					'data-search-page-url': searchPageUrl,
					'data-search-min-chars': String(minChars),
					'data-search-debounce-ms': String(debounceMs),
					'data-search-max-suggestions': String(maxSuggestions),
				}}
			/>
			<script dangerouslySetInnerHTML={{ __html: enhanceScript }} />
		</>
	);
};

export default ProductSearchSSR;
