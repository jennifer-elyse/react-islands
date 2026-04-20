'use client';

import React, { useEffect, useRef, useState } from 'react';
import { carouselBaseCss } from '../designSystem/carouselBaseCss.js';
import { resolveComponentDesignSystem } from '../designSystem/resolveComponentDesignSystem.js';

const cx = (...values) => values.filter(Boolean).join(' ');
const toCssSize = (value) => {
	if (typeof value === 'number' && Number.isFinite(value)) return `${value}px`;
	if (typeof value === 'string' && value.trim()) return value;
	return undefined;
};

const toPositiveNumber = (value) => {
	const next = Number(value);
	return Number.isFinite(next) && next > 0 ? next : undefined;
};

const parseRatioPair = (value, firstKey, secondKey) => {
	if (Array.isArray(value) && value.length >= 2) {
		const first = toPositiveNumber(value[0]);
		const second = toPositiveNumber(value[1]);
		if (first && second) return { first, second };
	}

	if (value && typeof value === 'object') {
		const first = toPositiveNumber(value[firstKey]);
		const second = toPositiveNumber(value[secondKey]);
		if (first && second) return { first, second };
	}

	if (typeof value === 'string') {
		const parts = value
			.split(/[:/,\s]+/)
			.map((part) => toPositiveNumber(part))
			.filter(Boolean);
		if (parts.length >= 2) return { first: parts[0], second: parts[1] };
	}

	return undefined;
};

const parseSlideImageTextRatio = (value) => {
	const ratio = parseRatioPair(value, 'image', 'text');
	return ratio ? { image: ratio.first, text: ratio.second } : undefined;
};

const parseStickySlideSizeRatio = (value) => {
	const ratio = parseRatioPair(value, 'sticky', 'slide');
	return ratio ? { sticky: ratio.first, slide: ratio.second } : undefined;
};

const toWholeCount = (value) => {
	const parsed = Number(value);
	if (!Number.isFinite(parsed)) return undefined;
	return Math.max(0, Math.trunc(parsed));
};

const resolvePinnedPaneCount = (variant, options, slideCount) => {
	const configuredCount = toWholeCount(
		options?.stickyPaneCount ?? options?.stickySlideCount ?? options?.stickySlides,
	);
	if (configuredCount !== undefined) {
		return Math.min(configuredCount, slideCount);
	}

	// Backward compatibility for older carousel payloads.
	if (variant === 'pin-first-marquee' && options?.freezeFirstFrame) {
		return Math.min(1, slideCount);
	}

	return 0;
};

const getSlideElements = (scroller) => Array.from(scroller?.querySelectorAll('[data-carousel-slide]') || []);

const getPageStartIndexes = (maxIndex, pageStep) => {
	const safeMaxIndex = Math.max(0, maxIndex);
	const safePageStep = Math.max(1, pageStep);
	const indexes = [];

	for (let nextIndex = 0; nextIndex <= safeMaxIndex; nextIndex += safePageStep) {
		indexes.push(nextIndex);
	}

	if (indexes[indexes.length - 1] !== safeMaxIndex) {
		indexes.push(safeMaxIndex);
	}

	return indexes;
};

const getScrollLeftForIndex = (scroller, targetIndex, maxIndex) => {
	const slides = getSlideElements(scroller);
	if (!slides.length) return 0;

	const maxScrollLeft = Math.max(0, scroller.scrollWidth - scroller.clientWidth);
	if (targetIndex <= 0) return 0;
	if (targetIndex >= maxIndex) return maxScrollLeft;

	const target = slides[targetIndex];
	if (!target) return maxScrollLeft;

	const scrollerRect = scroller.getBoundingClientRect();
	const targetRect = target.getBoundingClientRect();
	return Math.min(maxScrollLeft, targetRect.left - scrollerRect.left + scroller.scrollLeft);
};

const getNearestCarouselIndex = (scroller, maxIndex, pageStep) => {
	if (maxIndex <= 0) return 0;

	return getPageStartIndexes(maxIndex, pageStep).reduce(
		(best, candidateIndex) => {
			const distance = Math.abs(getScrollLeftForIndex(scroller, candidateIndex, maxIndex) - scroller.scrollLeft);
			return distance < best.distance ? { index: candidateIndex, distance } : best;
		},
		{ index: 0, distance: Number.POSITIVE_INFINITY },
	).index;
};

const getScrollNavigationState = (scroller, maxIndex, pageStep) => {
	const pageIndexes = getPageStartIndexes(maxIndex, pageStep);
	const index = getNearestCarouselIndex(scroller, maxIndex, pageStep);
	const pagePosition = pageIndexes.indexOf(index);

	return {
		index,
		canGoPrev: pagePosition > 0,
		canGoNext: pagePosition < pageIndexes.length - 1,
		pageIndexes,
		pagePosition,
	};
};

const scrollToPosition = (scroller, left) => {
	if (!scroller) return false;
	scroller.scrollTo({
		left,
		behavior: 'smooth',
	});
	return true;
};

const useCarouselState = ({ count, maxIndex, pageStep, autoPlayMs, pauseOnHover, enableAutoPlay, scrollerRef }) => {
	const [index, setIndex] = useState(0);
	const [hoverPaused, setHoverPaused] = useState(false);
	const [userPaused, setUserPaused] = useState(false);
	const paused = hoverPaused || userPaused;
	const scrollSettledTimerRef = useRef(null);

	useEffect(() => {
		const scroller = scrollerRef.current;
		if (!scroller || count <= 1) return undefined;

		const syncIndexFromScroll = () => {
			const nextState = getScrollNavigationState(scroller, maxIndex, pageStep);
			setIndex(nextState.index);
		};

		const updateIndexFromScroll = () => {
			window.clearTimeout(scrollSettledTimerRef.current);
			scrollSettledTimerRef.current = window.setTimeout(() => {
				syncIndexFromScroll();
			}, 120);
		};

		syncIndexFromScroll();
		scroller.addEventListener('scroll', updateIndexFromScroll, { passive: true });
		if ('onscrollend' in window) {
			scroller.addEventListener('scrollend', syncIndexFromScroll);
		}
		return () => {
			window.clearTimeout(scrollSettledTimerRef.current);
			scroller.removeEventListener('scroll', updateIndexFromScroll);
			if ('onscrollend' in window) {
				scroller.removeEventListener('scrollend', syncIndexFromScroll);
			}
		};
	}, [count, maxIndex, pageStep, scrollerRef]);

	useEffect(() => {
		if (!enableAutoPlay || count <= 1 || autoPlayMs <= 0 || paused) return undefined;
		const timer = window.setInterval(() => {
			const scroller = scrollerRef.current;
			const pageIndexes = getPageStartIndexes(maxIndex, pageStep);
			const pagePosition = pageIndexes.indexOf(index);
			const nextIndex = pagePosition >= pageIndexes.length - 1 ? 0 : pageIndexes[pagePosition + 1];
			scrollToPosition(scroller, getScrollLeftForIndex(scroller, nextIndex, maxIndex));
			setIndex(nextIndex);
		}, autoPlayMs);

		return () => window.clearInterval(timer);
	}, [autoPlayMs, count, enableAutoPlay, index, maxIndex, pageStep, paused, scrollerRef]);

	return {
		index,
		paused,
		userPaused,
		enableAutoPlay,
		setIndex,
		setHoverPaused: pauseOnHover ? setHoverPaused : () => {},
		toggleUserPaused: () => setUserPaused((prev) => !prev),
	};
};

const SlideCard = ({ slide, index, cardClassName }) => (
	<article className={cx('carousel__slide', cardClassName)} data-carousel-slide="" data-carousel-index={index}>
		<div className="carousel__media">
			<img src={slide.image} alt={slide.title} draggable="false" />
		</div>
		<div className="carousel__copy">
			{slide.eyebrow ? <span className="carousel__eyebrow">{slide.eyebrow}</span> : null}
			<h3 className="carousel__slide-title">{slide.title}</h3>
			<p className="carousel__slide-body">{slide.body}</p>
		</div>
	</article>
);

const renderControls = ({
	showArrows,
	prevDisabled,
	nextDisabled,
	onPrev,
	onNext,
	className = 'carousel__controls',
}) => {
	if (!showArrows) return null;

	return (
		<div className={className}>
			<button
				type="button"
				className="carousel__control"
				onClick={onPrev}
				aria-label="Previous slide"
				disabled={prevDisabled}
			>
				<span aria-hidden="true">‹</span>
			</button>
			<button
				type="button"
				className="carousel__control"
				onClick={onNext}
				aria-label="Next slide"
				disabled={nextDisabled}
			>
				<span aria-hidden="true">›</span>
			</button>
		</div>
	);
};

const CarouselStyleTag = () => <style data-react-islands-ui="carousel">{carouselBaseCss}</style>;

const Carousel = ({ title, slides = [], variant = 'peek-strip', options = {}, accentIconSrc, designSystem }) => {
	const {
		autoPlayMs = 3200,
		showDots = false,
		showArrows = true,
		showPlayPause = false,
		loopNavButtons = true,
		arrowPosition: rawArrowPosition = 'top',
		pauseOnHover = true,
	} = options;
	const arrowPosition = ['top', 'bottom', 'outer-sides'].includes(rawArrowPosition) ? rawArrowPosition : 'top';
	const configuredVisibleSlides = toPositiveNumber(options?.visibleSlides ?? options?.visibleScrollPanes);
	const visibleSlides = Math.max(1, configuredVisibleSlides || 1);
	const configuredScrollStep = toWholeCount(options?.scrollStep ?? options?.pageStep);
	const scrollStep = Math.max(1, configuredScrollStep || 1);

	const spotlight = variant === 'spotlight-dots';
	const pinnedPaneCount = resolvePinnedPaneCount(variant, options, slides.length);
	const hasPinnedPane = pinnedPaneCount > 0;
	const pinnedSlides = slides.slice(0, pinnedPaneCount);
	const scrollSlides = slides.slice(pinnedPaneCount);
	const minHeight = toCssSize(options.minHeight);
	const maxHeight = toCssSize(options.maxHeight);
	const slideImageTextRatio = parseSlideImageTextRatio(options.slideImageTextRatio);
	const stickySlideSizeRatio = parseStickySlideSizeRatio(options.stickySlideSizeRatio);
	const scrollerRef = useRef(null);
	const count = scrollSlides.length;
	const effectiveVisibleSlides = spotlight ? 1 : visibleSlides;
	const [isScrollable, setIsScrollable] = useState(() => count > 1);
	const pageStep = spotlight ? 1 : scrollStep;
	const maxIndex = Math.max(0, count - 1);
	const { index, paused, userPaused, enableAutoPlay, setIndex, setHoverPaused, toggleUserPaused } = useCarouselState({
		count,
		maxIndex,
		pageStep,
		autoPlayMs,
		pauseOnHover,
		enableAutoPlay: autoPlayMs > 0,
		scrollerRef,
	});

	useEffect(() => {
		const scroller = scrollerRef.current;
		if (!scroller) return undefined;

		const syncScrollableState = () => {
			setIsScrollable(scroller.scrollWidth - scroller.clientWidth > 1);
		};

		syncScrollableState();

		if (typeof ResizeObserver !== 'undefined') {
			const resizeObserver = new ResizeObserver(() => {
				syncScrollableState();
			});
			resizeObserver.observe(scroller);
			for (const slide of getSlideElements(scroller)) {
				resizeObserver.observe(slide);
			}
			return () => resizeObserver.disconnect();
		}

		window.addEventListener('resize', syncScrollableState);
		return () => window.removeEventListener('resize', syncScrollableState);
	}, [count, variant]);

	if (!slides.length) return null;

	const pageIndexes = getPageStartIndexes(maxIndex, pageStep);
	const pagePosition = pageIndexes.indexOf(index);
	const canGoPrev = loopNavButtons ? count > 1 : pagePosition > 0;
	const canGoNext = loopNavButtons ? count > 1 : pagePosition < pageIndexes.length - 1;

	const goPrev = () => {
		const scroller = scrollerRef.current;
		if (!scroller) return;

		if (!canGoPrev) return;
		const nextIndex = loopNavButtons
			? pageIndexes[(pagePosition - 1 + pageIndexes.length) % pageIndexes.length]
			: pageIndexes[Math.max(0, pagePosition - 1)];
		if (scrollToPosition(scroller, getScrollLeftForIndex(scroller, nextIndex, maxIndex))) {
			setIndex(nextIndex);
		}
	};

	const goNext = () => {
		const scroller = scrollerRef.current;
		if (!scroller) return;

		if (!canGoNext) return;
		const nextIndex = loopNavButtons
			? pageIndexes[(pagePosition + 1) % pageIndexes.length]
			: pageIndexes[Math.min(pageIndexes.length - 1, pagePosition + 1)];
		if (scrollToPosition(scroller, getScrollLeftForIndex(scroller, nextIndex, maxIndex))) {
			setIndex(nextIndex);
		}
	};

	const prevDisabled = loopNavButtons ? count <= 1 : !canGoPrev;
	const nextDisabled = loopNavButtons ? count <= 1 : !canGoNext;
	const shouldShowArrows = showArrows && count > 0 && isScrollable;
	const shouldShowDots = showDots && pageIndexes.length > 1 && isScrollable;
	const rootDesign = resolveComponentDesignSystem({
		componentName: 'carousel',
		designSystem,
		className: `carousel--${variant}`,
		defaultClassName: 'carousel',
		defaultAttrs: { 'data-carousel-variant': variant },
	});

	return (
		<div
			className={cx(rootDesign.className, paused && 'is-paused')}
			style={rootDesign.style}
			data-carousel-arrow-position={arrowPosition}
			data-carousel-has-pinned={hasPinnedPane ? 'true' : 'false'}
			{...rootDesign.attrs}
			onMouseEnter={pauseOnHover ? () => setHoverPaused(true) : undefined}
			onMouseLeave={pauseOnHover ? () => setHoverPaused(false) : undefined}
		>
			<CarouselStyleTag />
			<div className="carousel__header">
				<h2 className="carousel__title">{title}</h2>
				{arrowPosition === 'top'
					? renderControls({
							showArrows: shouldShowArrows,
							prevDisabled,
							nextDisabled,
							onPrev: goPrev,
							onNext: goNext,
						})
					: null}
			</div>
			<div className="carousel__viewport">
				{arrowPosition === 'outer-sides'
					? renderControls({
							showArrows: shouldShowArrows,
							prevDisabled,
							nextDisabled,
							onPrev: goPrev,
							onNext: goNext,
							className: 'carousel__controls carousel__controls--outer-sides',
						})
					: null}
				{accentIconSrc ? (
					<div className="carousel__accent">
						<img src={accentIconSrc} alt="" />
					</div>
				) : null}

				<div
					className={cx('carousel__layout', hasPinnedPane && 'carousel__layout--pinned')}
					style={{
						'--carousel-visible-slides': `${effectiveVisibleSlides}`,
						...(minHeight ? { '--carousel-min-height': minHeight } : {}),
						...(maxHeight ? { '--carousel-max-height': maxHeight } : {}),
						...(slideImageTextRatio
							? {
									'--carousel-slide-media-fr': `${slideImageTextRatio.image}`,
									'--carousel-slide-copy-fr': `${slideImageTextRatio.text}`,
								}
							: {}),
						...(stickySlideSizeRatio
							? {
									'--carousel-sticky-pane-width': `${stickySlideSizeRatio.sticky}fr`,
									'--carousel-scroll-pane-width': `${stickySlideSizeRatio.slide * effectiveVisibleSlides}fr`,
								}
							: {}),
					}}
				>
					{hasPinnedPane ? (
						<div className="carousel__pinned">
							<div className="carousel__pinned-stack">
								{pinnedSlides.map((slide, pinnedIndex) => (
									<SlideCard
										key={`${slide.title}-pinned-${pinnedIndex}`}
										slide={slide}
										index={pinnedIndex}
										cardClassName="carousel__slide--pinned"
									/>
								))}
							</div>
						</div>
					) : null}

					<div
						ref={scrollerRef}
						className={cx(
							'carousel__scroller',
							spotlight && 'carousel__scroller--spotlight',
							hasPinnedPane && 'carousel__scroller--rail',
						)}
						tabIndex={0}
						role="region"
						aria-label={`${title} carousel`}
					>
						{scrollSlides.map((slide, slideIndex) => (
							<SlideCard
								key={`${slide.title}-${slideIndex}`}
								slide={slide}
								index={slideIndex}
								cardClassName={cx(
									`carousel__slide--${variant}`,
									spotlight && slideIndex === index && 'is-current',
								)}
							/>
						))}
					</div>
				</div>
			</div>
			{arrowPosition === 'bottom'
				? renderControls({
						showArrows: shouldShowArrows,
						prevDisabled,
						nextDisabled,
						onPrev: goPrev,
						onNext: goNext,
						className: 'carousel__controls carousel__controls--bottom',
					})
				: null}
			{shouldShowDots ? (
				<div className={cx('carousel__footer', showPlayPause && 'carousel__footer--has-play-pause')}>
					<div className="carousel__dots" aria-label="Carousel pagination">
						{pageIndexes.map((pageIdx, dotIndex) => (
							<button
								key={`page-${dotIndex}-dot`}
								type="button"
								className="carousel__dot"
								data-active={pageIdx === index ? 'true' : 'false'}
								aria-label={`Go to page ${dotIndex + 1}`}
								onClick={() => {
									const scroller = scrollerRef.current;
									if (
										scrollToPosition(scroller, getScrollLeftForIndex(scroller, pageIdx, maxIndex))
									) {
										setIndex(pageIdx);
									}
								}}
							/>
						))}
					</div>
					{showPlayPause ? (
						<button
							type="button"
							className="carousel__play-pause"
							aria-label={userPaused ? 'Play carousel' : 'Pause carousel'}
							onClick={toggleUserPaused}
						>
							{userPaused ? (
								<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
									<path d="M8 5v14l11-7z" />
								</svg>
							) : (
								<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
									<rect x="6" y="4" width="4" height="16" />
									<rect x="14" y="4" width="4" height="16" />
								</svg>
							)}
						</button>
					) : null}
				</div>
			) : showPlayPause ? (
				<div className="carousel__footer carousel__footer--play-only">
					<button
						type="button"
						className="carousel__play-pause"
						aria-label={userPaused ? 'Play carousel' : 'Pause carousel'}
						onClick={toggleUserPaused}
					>
						{userPaused ? (
							<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
								<path d="M8 5v14l11-7z" />
							</svg>
						) : (
							<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
								<rect x="6" y="4" width="4" height="16" />
								<rect x="14" y="4" width="4" height="16" />
							</svg>
						)}
					</button>
				</div>
			) : null}
		</div>
	);
};

export default Carousel;
