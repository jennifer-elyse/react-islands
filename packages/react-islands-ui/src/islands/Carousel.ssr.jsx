import React from 'react';
import { carouselBaseCss } from '../designSystem/carouselBaseCss.js';
import { resolveComponentDesignSystem } from '../designSystem/resolveComponentDesignSystem.js';

const SlideCard = ({ slide, index, cardClassName }) => (
	<article
		className={['carousel__slide', cardClassName].filter(Boolean).join(' ')}
		data-carousel-slide=""
		data-carousel-index={index}
	>
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

const renderControls = ({ showArrows, canGoPrev, canGoNext, className = 'carousel__controls' }) => {
	if (!showArrows) return null;

	return (
		<div className={className}>
			<button type="button" className="carousel__control" disabled={!canGoPrev} aria-label="Previous slide">
				<span aria-hidden="true">‹</span>
			</button>
			<button type="button" className="carousel__control" disabled={!canGoNext} aria-label="Next slide">
				<span aria-hidden="true">›</span>
			</button>
		</div>
	);
};

const CarouselStyleTag = () => <style data-react-islands-ui="carousel">{carouselBaseCss}</style>;

const CarouselSSR = ({ title, slides = [], variant = 'peek-strip', accentIconSrc, options = {}, designSystem }) => {
	const spotlight = variant === 'spotlight-dots';
	const configuredVisibleSlides = toPositiveNumber(options?.visibleSlides ?? options?.visibleScrollPanes);
	const visibleSlides = Math.max(1, configuredVisibleSlides || 1);
	const configuredScrollStep = toWholeCount(options?.scrollStep ?? options?.pageStep);
	const scrollStep = Math.max(1, configuredScrollStep || 1);
	const pinnedPaneCount = resolvePinnedPaneCount(variant, options, slides.length);
	const hasPinnedPane = pinnedPaneCount > 0;
	const pinnedSlides = slides.slice(0, pinnedPaneCount);
	const scrollSlides = slides.slice(pinnedPaneCount);
	const ssrSlides = scrollSlides;
	const loopNavButtons = options.loopNavButtons ?? true;
	const pageStep = spotlight ? 1 : scrollStep;
	const pageIndexes = getPageStartIndexes(Math.max(0, scrollSlides.length - 1), pageStep);
	const canGoPrev = loopNavButtons ? scrollSlides.length > 1 : false;
	const canGoNext = loopNavButtons ? scrollSlides.length > 1 : pageIndexes.length > 1;
	const showDots = options.showDots;
	const showPlayPause = options.showPlayPause;
	const minHeight = toCssSize(options.minHeight);
	const maxHeight = toCssSize(options.maxHeight);
	const slideImageTextRatio = parseSlideImageTextRatio(options.slideImageTextRatio);
	const stickySlideSizeRatio = parseStickySlideSizeRatio(options.stickySlideSizeRatio);
	const arrowPosition = ['top', 'bottom', 'outer-sides'].includes(options.arrowPosition)
		? options.arrowPosition
		: 'top';

	const rootDesign = resolveComponentDesignSystem({
		componentName: 'carousel',
		designSystem,
		className: `carousel--${variant}`,
		defaultClassName: 'carousel',
		defaultAttrs: { 'data-carousel-variant': variant },
	});

	return (
		<div
			className={rootDesign.className}
			style={rootDesign.style}
			data-carousel-arrow-position={arrowPosition}
			data-carousel-has-pinned={hasPinnedPane ? 'true' : 'false'}
			{...rootDesign.attrs}
		>
			<CarouselStyleTag />
			<div className="carousel__header">
				<h2 className="carousel__title">{title}</h2>
				{arrowPosition === 'top'
					? renderControls({
							showArrows: options.showArrows,
							canGoPrev,
							canGoNext,
						})
					: null}
			</div>
			<div className="carousel__viewport">
				{arrowPosition === 'outer-sides'
					? renderControls({
							showArrows: options.showArrows,
							canGoPrev,
							canGoNext,
							className: 'carousel__controls carousel__controls--outer-sides',
						})
					: null}
				{accentIconSrc ? (
					<div className="carousel__accent">
						<img src={accentIconSrc} alt="" />
					</div>
				) : null}
			<div
				className={`carousel__layout${hasPinnedPane ? ' carousel__layout--pinned' : ''}`}
				style={{
					'--carousel-visible-slides': `${spotlight ? 1 : visibleSlides}`,
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
								'--carousel-scroll-pane-width': `${stickySlideSizeRatio.slide * (spotlight ? 1 : visibleSlides)}fr`,
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
						className={`carousel__scroller${
							variant === 'spotlight-dots' ? ' carousel__scroller--spotlight' : ''
						}${hasPinnedPane ? ' carousel__scroller--rail' : ''}`}
						tabIndex={0}
						role="region"
						aria-label={`${title} carousel`}
					>
						{ssrSlides.map((slide, index) => (
							<SlideCard
								key={`${slide.title}-${index}`}
								slide={slide}
								index={index}
								cardClassName={[
									`carousel__slide--${variant}`,
									spotlight && index === 0 ? 'is-current' : '',
								]
									.filter(Boolean)
									.join(' ')}
							/>
						))}
					</div>
				</div>
			</div>
			{arrowPosition === 'bottom'
				? renderControls({
						showArrows: options.showArrows,
						canGoPrev,
						canGoNext,
						className: 'carousel__controls carousel__controls--bottom',
					})
				: null}
			{showDots && pageIndexes.length > 1 ? (
				<div
					className={['carousel__footer', showPlayPause && 'carousel__footer--has-play-pause']
						.filter(Boolean)
						.join(' ')}
				>
					<div className="carousel__dots" aria-label="Carousel pagination">
						{pageIndexes.map((pageIdx, dotIndex) => (
							<button
								key={`page-${dotIndex}-dot`}
								type="button"
								className="carousel__dot"
								data-active={dotIndex === 0 ? 'true' : 'false'}
								aria-label={`Go to page ${dotIndex + 1}`}
							/>
						))}
					</div>
					{showPlayPause ? (
						<button type="button" className="carousel__play-pause" aria-label="Pause carousel">
							<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
								<rect x="6" y="4" width="4" height="16" />
								<rect x="14" y="4" width="4" height="16" />
							</svg>
						</button>
					) : null}
				</div>
			) : showPlayPause ? (
				<div className="carousel__footer carousel__footer--play-only">
					<button type="button" className="carousel__play-pause" aria-label="Pause carousel">
						<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
							<rect x="6" y="4" width="4" height="16" />
							<rect x="14" y="4" width="4" height="16" />
						</svg>
					</button>
				</div>
			) : null}
		</div>
	);
};

export default CarouselSSR;
