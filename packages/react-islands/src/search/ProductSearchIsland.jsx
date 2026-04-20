'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ProductSearchShell } from './ProductSearchShell.jsx';

const normalizeRecentTerm = (value) => {
	if (typeof value === 'string') return value;
	if (value && typeof value === 'object') {
		if (typeof value.text === 'string') return value.text;
		if (typeof value.label === 'string') return value.label;
		if (typeof value.query === 'string') return value.query;
	}
	return '';
};

const normalizeSuggestion = (item, idx) => {
	if (!item || typeof item !== 'object') {
		return {
			id: `suggestion-${idx}`,
			text: String(item || ''),
			type: 'product',
			slug: null,
			imageUrl: null,
			price: null,
		};
	}

	return {
		...item,
		id: item.id || item.slug || item.sku || `${item.type || 'suggestion'}-${idx}`,
		text: item.text || item.label || item.query || '',
	};
};

export const ProductSearchIsland = ({
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
	designSystem,
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
				const parsed = JSON.parse(stored);
				const normalized = Array.isArray(parsed)
					? parsed.map(normalizeRecentTerm).filter(Boolean).slice(0, 5)
					: [];
				setRecentSearches(normalized);
				localStorage.setItem('recentSearches', JSON.stringify(normalized));
			}
		} catch (_error) {
			// Ignore storage errors.
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
				const normalizedTerm = normalizeRecentTerm(term);
				if (!normalizedTerm) return;
				const updated = [
					normalizedTerm,
					...recentSearches.filter((s) => s.toLowerCase() !== normalizedTerm.toLowerCase()),
				].slice(0, 5);
				setRecentSearches(updated);
				localStorage.setItem('recentSearches', JSON.stringify(updated));
			} catch (_error) {
				// Ignore storage errors.
			}
		},
		[recentSearches],
	);

	const fetchSuggestions = useCallback(
		async (searchQuery) => {
			if (!searchQuery || searchQuery.length < minChars) {
				setSuggestions([]);
				setActiveTab(recentSearches.length > 0 ? 'recent' : 'suggestions');
				setIsOpen(recentSearches.length > 0);
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

				const next = data?.success ? (data.suggestions || []).map(normalizeSuggestion) : [];
				setSuggestions(next);
				setIsOpen(true);
			} catch (err) {
				if (err.name !== 'AbortError') {
					console.error('Search error:', err);
					setSuggestions([]);
					setIsOpen(true);
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
		if (!value) {
			setIsOpen(recentSearches.length > 0);
			setActiveTab(recentSearches.length > 0 ? 'recent' : 'suggestions');
		} else if (value.length >= minChars) {
			setIsOpen(true);
			setActiveTab('suggestions');
		}

		if (debounceRef.current) clearTimeout(debounceRef.current);
		debounceRef.current = setTimeout(() => fetchSuggestions(value), debounceMs);
	};

	const handleSuggestionClick = (suggestion) => {
		const text = normalizeRecentTerm(suggestion?.text || suggestion?.label || suggestion?.query);
		if (suggestion.type === 'product' && suggestion.slug) {
			saveRecentSearch(text);
			window.location.href = `/products/${suggestion.slug}`;
		} else if (suggestion.type === 'category' && suggestion.slug) {
			window.location.href = `/category/${suggestion.slug}`;
		} else {
			saveRecentSearch(text);
			window.location.href = `${searchPageUrl}?q=${encodeURIComponent(text)}`;
		}
	};

	const handleRecentClick = (term) => {
		const normalizedTerm = normalizeRecentTerm(term);
		setQuery(normalizedTerm);
		window.location.href = `${searchPageUrl}?q=${encodeURIComponent(normalizedTerm)}`;
	};

	const handleSubmit = (e) => {
		e.preventDefault();
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

	const clearRecentSearches = (e) => {
		e.stopPropagation();
		setRecentSearches([]);
		try {
			localStorage.removeItem('recentSearches');
		} catch (_error) {
			// Ignore storage errors.
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
		const regex = new RegExp(`(${q.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')})`, 'gi');
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

	const canShowDropdown = query.length >= minChars || recentSearches.length > 0;
	const showDropdown = isOpen && canShowDropdown;

	return (
		<ProductSearchShell
			placeholder={placeholder}
			value={query}
			autoFocus={autoFocus}
			designSystem={designSystem}
			onChange={handleInputChange}
			onKeyDown={handleKeyDown}
			onFocus={handleFocus}
			onSubmit={handleSubmit}
			inputRef={inputRef}
			showSpinner={isLoading}
			ariaExpanded={showDropdown}
		>
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
											{highlightMatch(item.text || '', query)}
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
										key={`${term}-${idx}`}
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
		</ProductSearchShell>
	);
};

export default ProductSearchIsland;
