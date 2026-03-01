'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createRoot } from 'react-dom/client';

const ProductSearch = ({
	endpoint = '/api/search/suggestions',
	searchPageUrl = '/search',
	placeholder = 'Search products...',
	minChars = 1,
	debounceMs = 200,
	maxSuggestions = 8,
	showImages = true,
	showPrices = true,
	fuzzyMatch = true,
	autoFocus = true,
}) => {
	const [query, setQuery] = useState('');
	const [suggestions, setSuggestions] = useState([]);
	const [recentSearches, setRecentSearches] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const [selectedIndex, setSelectedIndex] = useState(-1);
	const [activeTab, setActiveTab] = useState('suggestions');

	const inputRef = useRef(null);
	const dropdownRef = useRef(null);
	const debounceRef = useRef(null);
	const abortRef = useRef(null);

	useEffect(() => {
		try {
			const stored = localStorage.getItem('recentSearches');
			if (stored) {
				setRecentSearches(JSON.parse(stored).slice(0, 5));
			}
		} catch (e) {
			// ignore storage errors
		}
	}, []);

	useEffect(() => {
		if (autoFocus && inputRef.current) {
			inputRef.current.focus();
		}
	}, [autoFocus]);

	const saveRecentSearch = useCallback(
		(term) => {
			try {
				const updated = [term, ...recentSearches.filter((s) => s.toLowerCase() !== term.toLowerCase())].slice(
					0,
					5,
				);
				setRecentSearches(updated);
				localStorage.setItem('recentSearches', JSON.stringify(updated));
			} catch (e) {
				// ignore storage errors
			}
		},
		[recentSearches],
	);

	const fetchSuggestions = useCallback(
		async (searchQuery) => {
			if (!searchQuery || searchQuery.length < minChars) {
				setSuggestions([]);
				setActiveTab(recentSearches.length > 0 ? 'recent' : 'suggestions');
				setIsOpen(false);
				return;
			}

			if (abortRef.current) abortRef.current.abort();
			abortRef.current = new AbortController();

			setIsLoading(true);
			setActiveTab('suggestions');

			try {
				const params = new URLSearchParams({
					q: searchQuery,
					limit: maxSuggestions.toString(),
					fuzzy: fuzzyMatch ? 'true' : 'false',
				});

				const res = await fetch(`${endpoint}?${params.toString()}`, {
					signal: abortRef.current.signal,
				});

				if (!res.ok) throw new Error('Search failed');
				const data = await res.json();

				const next = data?.success ? data.suggestions || [] : [];
				setSuggestions(next);
				setIsOpen(next.length > 0);
			} catch (err) {
				if (err.name !== 'AbortError') {
					console.error('Search error:', err);
					setSuggestions([]);
					setIsOpen(false);
				}
			} finally {
				setIsLoading(false);
			}
		},
		[endpoint, minChars, maxSuggestions, fuzzyMatch, recentSearches.length],
	);

	const handleInputChange = (e) => {
		const value = e.target.value;
		setQuery(value);
		setSelectedIndex(-1);

		if (debounceRef.current) clearTimeout(debounceRef.current);
		debounceRef.current = setTimeout(() => fetchSuggestions(value), debounceMs);
	};

	const handleKeyDown = (e) => {
		const items = activeTab === 'suggestions' ? suggestions : recentSearches;
		const count = items.length;

		if (!isOpen && e.key !== 'Enter') {
			if (query.length === 0 && recentSearches.length > 0) {
				setIsOpen(true);
				setActiveTab('recent');
			}
			return;
		}

		switch (e.key) {
			case 'ArrowDown':
				e.preventDefault();
				setSelectedIndex((prev) => (prev < count - 1 ? prev + 1 : prev));
				break;
			case 'ArrowUp':
				e.preventDefault();
				setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
				break;
			case 'Tab':
				if (suggestions.length > 0 && recentSearches.length > 0) {
					e.preventDefault();
					setActiveTab((prev) => (prev === 'suggestions' ? 'recent' : 'suggestions'));
					setSelectedIndex(-1);
				}
				break;
			case 'Enter':
				e.preventDefault();
				if (selectedIndex >= 0 && selectedIndex < count) {
					const item = items[selectedIndex];
					activeTab === 'suggestions' ? handleSuggestionClick(item) : handleRecentClick(item);
				} else {
					handleSubmit(e);
				}
				break;
			case 'Escape':
				setIsOpen(false);
				setSelectedIndex(-1);
				if (inputRef.current) inputRef.current.blur();
				break;
			default:
				break;
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const trimmed = query.trim();
		if (trimmed) {
			saveRecentSearch(trimmed);
			window.location.href = `${searchPageUrl}?q=${encodeURIComponent(trimmed)}`;
		}
	};

	const handleSuggestionClick = (suggestion) => {
		if (suggestion.type === 'product' && suggestion.slug) {
			saveRecentSearch(suggestion.text);
			window.location.href = `/product/${suggestion.slug}`;
		} else if (suggestion.type === 'category' && suggestion.slug) {
			window.location.href = `/category/${suggestion.slug}`;
		} else {
			saveRecentSearch(suggestion.text);
			window.location.href = `${searchPageUrl}?q=${encodeURIComponent(suggestion.text)}`;
		}
	};

	const handleRecentClick = (term) => {
		setQuery(term);
		window.location.href = `${searchPageUrl}?q=${encodeURIComponent(term)}`;
	};

	const clearRecentSearches = (e) => {
		e.stopPropagation();
		setRecentSearches([]);
		try {
			localStorage.removeItem('recentSearches');
		} catch (err) {
			// ignore storage errors
		}
	};

	const handleFocus = () => {
		if (query.length >= minChars && suggestions.length > 0) {
			setIsOpen(true);
			setActiveTab('suggestions');
		} else if (recentSearches.length > 0) {
			setIsOpen(true);
			setActiveTab('recent');
		}
	};

	useEffect(() => {
		const handleClickOutside = (e) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(e.target) &&
				!inputRef.current?.contains(e.target)
			) {
				setIsOpen(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	useEffect(
		() => () => {
			if (debounceRef.current) clearTimeout(debounceRef.current);
			if (abortRef.current) abortRef.current.abort();
		},
		[],
	);

	useEffect(() => {
		if (suggestions.length > 0) setIsOpen(true);
	}, [suggestions]);

	const highlightMatch = (text, q) => {
		if (!q || !fuzzyMatch) return text;
		const regex = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
		return text.split(regex).map((part, i) =>
			regex.test(part) ? (
				<mark key={i} className="search-highlight">
					{part}
				</mark>
			) : (
				part
			),
		);
	};

	const showDropdown = isOpen && (suggestions.length > 0 || recentSearches.length > 0);

	return (
		<form onSubmit={handleSubmit} className="search-island" role="search">
			<div className="search-island__input-wrapper">
				<input
					ref={inputRef}
					type="search"
					value={query}
					onChange={handleInputChange}
					onKeyDown={handleKeyDown}
					onFocus={handleFocus}
					placeholder={placeholder}
					className="search-island__input"
					autoComplete="off"
					aria-label="Search products"
					aria-expanded={showDropdown}
				/>
				{isLoading && <span className="search-island__spinner" />}
				<button type="submit" className="search-island__btn">
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
						<circle cx="11" cy="11" r="8" />
						<path d="m21 21-4.35-4.35" />
					</svg>
				</button>
			</div>

			{showDropdown && (
				<div ref={dropdownRef} className="search-island__dropdown">
					{suggestions.length > 0 && recentSearches.length > 0 && (
						<div className="search-island__tabs">
							<button
								type="button"
								className={`search-island__tab ${activeTab === 'suggestions' ? 'search-island__tab--active' : ''}`}
								onClick={() => {
									setActiveTab('suggestions');
									setSelectedIndex(-1);
								}}
							>
								Suggestions
							</button>
							<button
								type="button"
								className={`search-island__tab ${activeTab === 'recent' ? 'search-island__tab--active' : ''}`}
								onClick={() => {
									setActiveTab('recent');
									setSelectedIndex(-1);
								}}
							>
								Recent
							</button>
						</div>
					)}

					{activeTab === 'suggestions' && suggestions.length > 0 && (
						<ul className="search-island__list">
							{suggestions.map((item, idx) => (
								<li
									key={item.id || idx}
									className={`search-island__item ${idx === selectedIndex ? 'search-island__item--selected' : ''}`}
									onClick={() => handleSuggestionClick(item)}
								>
									{showImages && item.imageUrl && (
										<img src={item.imageUrl} alt="" className="search-island__item-img" />
									)}
									<div className="search-island__item-content">
										<span className="search-island__item-text">
											{highlightMatch(item.text, query)}
										</span>
										{item.type === 'category' && (
											<span className="search-island__item-badge">Category</span>
										)}
										{showPrices && item.price && (
											<span className="search-island__item-price">{item.price}</span>
										)}
									</div>
								</li>
							))}
						</ul>
					)}

					{activeTab === 'recent' && recentSearches.length > 0 && (
						<>
							<div className="search-island__recent-header">
								<span>Recent Searches</span>
								<button
									type="button"
									className="search-island__clear-btn"
									onClick={clearRecentSearches}
								>
									Clear
								</button>
							</div>
							<ul className="search-island__list">
								{recentSearches.map((term, idx) => (
									<li
										key={term}
										className={`search-island__item ${idx === selectedIndex ? 'search-island__item--selected' : ''}`}
										onClick={() => handleRecentClick(term)}
									>
										<svg
											className="search-island__item-icon"
											width="16"
											height="16"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
										>
											<circle cx="12" cy="12" r="10" />
											<polyline points="12,6 12,12 16,14" />
										</svg>
										<span className="search-island__item-text">{term}</span>
									</li>
								))}
							</ul>
						</>
					)}

					{activeTab === 'suggestions' &&
						query.length >= minChars &&
						suggestions.length === 0 &&
						!isLoading && <div className="search-island__empty">No products found for "{query}"</div>}
				</div>
			)}

			<style>{`
				.search-island { position: relative; width: 100%; }
				.search-island__input-wrapper { display: flex; align-items: center; background: #fff; border: 1px solid #dee2e6; border-radius: 8px; transition: border-color 0.2s, box-shadow 0.2s; }
				.search-island__input-wrapper:focus-within { border-color: #2d6a4f; box-shadow: 0 0 0 3px rgba(45,106,79,0.15); }
				.search-island__input { flex: 1; padding: 10px 16px; border: none; background: transparent; font-size: 1rem; outline: none; }
				.search-island__spinner { width: 18px; height: 18px; border: 2px solid #dee2e6; border-top-color: #2d6a4f; border-radius: 50%; animation: spin 0.8s linear infinite; margin-right: 8px; }
				@keyframes spin { to { transform: rotate(360deg); } }
				.search-island__btn { display: flex; align-items: center; justify-content: center; padding: 10px 14px; background: #2d6a4f; color: white; border: none; border-radius: 0 7px 7px 0; cursor: pointer; }
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
		</form>
	);
};

export function mount(el, props) {
	const root = createRoot(el);
	root.render(<ProductSearch {...props} />);
}

export default ProductSearch;
