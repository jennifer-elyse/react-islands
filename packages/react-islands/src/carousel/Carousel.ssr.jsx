import React from 'react';
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

const CarouselSSR = ({ title, slides = [], variant = 'peek-strip', accentIconSrc, options = {}, designSystem }) => {
	const pinnedPane = variant === 'pin-first-marquee' && options.freezeFirstFrame;
	const pinnedSlide = pinnedPane ? slides[0] : null;
	const scrollSlides = pinnedPane ? slides.slice(1) : slides;
	const spotlight = variant === 'spotlight-dots';
	const ssrSlides = scrollSlides;
	const loopNavButtons = options.loopNavButtons ?? true;
	const canGoPrev = loopNavButtons ? scrollSlides.length > 1 : false;
	const canGoNext = scrollSlides.length > 1;

	const rootDesign = resolveComponentDesignSystem({
		componentName: 'carousel',
		designSystem,
		className: `carousel--${variant}`,
		defaultClassName: 'carousel',
		defaultAttrs: { 'data-carousel-variant': variant },
	});

	return (
		<div className={rootDesign.className} style={rootDesign.style} {...rootDesign.attrs}>
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
			{options.showDots && scrollSlides.length > 1 ? (
				<div className="carousel__dots" aria-label="Carousel pagination">
					{scrollSlides.map((slide, index) => (
						<button
							key={`${slide.title}-dot`}
							type="button"
							className="carousel__dot"
							data-active={index === 0 ? 'true' : 'false'}
							aria-label={`Go to slide ${index + 1}`}
						/>
					))}
				</div>
			) : null}
		</div>
	);
};

export default CarouselSSR;
