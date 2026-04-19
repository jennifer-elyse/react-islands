import React from 'react';

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

const CarouselSSR = ({ title, slides = [], variant = 'peek-strip', accentIconSrc, options = {} }) => {
	const pinnedPane = variant === 'pin-first-marquee' && options.freezeFirstFrame;
	const pinnedSlide = pinnedPane ? slides[0] : null;
	const scrollSlides = pinnedPane ? slides.slice(1) : slides;
	const spotlight = variant === 'spotlight-dots';
	const ssrSlides = scrollSlides;
	const loopNavButtons = options.loopNavButtons ?? true;
	const canGoPrev = loopNavButtons ? scrollSlides.length > 1 : false;
<<<<<<< Updated upstream:examples/_shared/runtime/src/islands/Carousel.ssr.jsx
	const canGoNext = scrollSlides.length > 1;
=======
	const canGoNext = loopNavButtons ? scrollSlides.length > 1 : pageIndexes.length > 1;
	const showDots = options.showDots;
	const showPlayPause = options.showPlayPause;
>>>>>>> Stashed changes:packages/react-islands-ui/src/islands/Carousel.ssr.jsx

	return (
		<div className={`carousel carousel--${variant}`}>
			<div className="carousel__header">
				<h2 className="carousel__title">{title}</h2>
				{options.showArrows ? (
					<div className="carousel__controls">
						<button
							type="button"
							className="carousel__control"
							disabled={!canGoPrev}
							aria-label="Previous slide"
						>
							<span aria-hidden="true">‹</span>
						</button>
						<button
							type="button"
							className="carousel__control"
							disabled={!canGoNext}
							aria-label="Next slide"
						>
							<span aria-hidden="true">›</span>
						</button>
					</div>
				) : null}
			</div>
			<div className="carousel__viewport">
				{accentIconSrc ? (
					<div className="carousel__accent">
						<img src={accentIconSrc} alt="" />
					</div>
				) : null}
				<div className={`carousel__layout${pinnedPane ? ' carousel__layout--pinned' : ''}`}>
					{pinnedSlide ? (
						<div className="carousel__pinned">
							<SlideCard slide={pinnedSlide} index={0} cardClassName="carousel__slide--pinned" />
						</div>
					) : null}
					<div
						className={`carousel__scroller${
							variant === 'spotlight-dots' ? ' carousel__scroller--spotlight' : ''
						}${pinnedPane ? ' carousel__scroller--rail' : ''}`}
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
<<<<<<< Updated upstream:examples/_shared/runtime/src/islands/Carousel.ssr.jsx
			{options.showDots && scrollSlides.length > 1 ? (
				<div className="carousel__dots" aria-label="Carousel pagination">
					{scrollSlides.map((slide, index) => (
=======
			{arrowPosition === 'bottom'
				? renderControls({
						showArrows: options.showArrows,
						canGoPrev,
						canGoNext,
						className: 'carousel__controls carousel__controls--bottom',
					})
				: null}
			{showDots && pageIndexes.length > 1 ? (
				<div className={['carousel__footer', showPlayPause && 'carousel__footer--has-play-pause'].filter(Boolean).join(' ')}>
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
>>>>>>> Stashed changes:packages/react-islands-ui/src/islands/Carousel.ssr.jsx
						<button
							type="button"
							className="carousel__play-pause"
							aria-label="Pause carousel"
						>
							<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
						</button>
					) : null}
				</div>
			) : showPlayPause ? (
				<div className="carousel__footer carousel__footer--play-only">
					<button
						type="button"
						className="carousel__play-pause"
						aria-label="Pause carousel"
					>
						<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
					</button>
				</div>
			) : null}
		</div>
	);
};

export default CarouselSSR;
