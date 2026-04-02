import React from 'react';

const SlideCard = ({ slide, index, cardClassName }) => (
	<article
		className={['demo-carousel__slide', cardClassName].filter(Boolean).join(' ')}
		data-carousel-slide=""
		data-carousel-index={index}
	>
		<div className="demo-carousel__media">
			<img src={slide.image} alt={slide.title} />
		</div>
		<div className="demo-carousel__copy">
			{slide.eyebrow ? <span className="demo-carousel__eyebrow">{slide.eyebrow}</span> : null}
			<h3 className="demo-carousel__slide-title">{slide.title}</h3>
			<p className="demo-carousel__slide-body">{slide.body}</p>
		</div>
	</article>
);

const CarouselSSR = ({ title, slides = [], variant = 'peek-strip', accentIconSrc, options = {} }) => {
	const pinnedPane = variant === 'pin-first-marquee' && options.freezeFirstFrame;
	const pinnedSlide = pinnedPane ? slides[0] : null;
	const scrollSlides = pinnedPane ? slides.slice(1) : slides;
	const ssrSlides = variant === 'spotlight-dots' ? scrollSlides.slice(0, 1) : scrollSlides.slice(0, 3);

	return (
		<div className={`demo-carousel demo-carousel--${variant}`}>
			<div className="demo-carousel__header">
				<h2 className="demo-carousel__title">{title}</h2>
				{options.showArrows ? (
					<div className="demo-carousel__controls">
						<button type="button" className="demo-carousel__control" aria-label="Previous slide">
							<span aria-hidden="true">‹</span>
						</button>
						<button type="button" className="demo-carousel__control" aria-label="Next slide">
							<span aria-hidden="true">›</span>
						</button>
					</div>
				) : null}
			</div>
			<div className="demo-carousel__viewport">
				{accentIconSrc ? (
					<div className="demo-carousel__accent">
						<img src={accentIconSrc} alt="" />
					</div>
				) : null}
				<div className={`demo-carousel__layout${pinnedPane ? ' demo-carousel__layout--pinned' : ''}`}>
					{pinnedSlide ? (
						<div className="demo-carousel__pinned">
							<SlideCard slide={pinnedSlide} index={0} cardClassName="demo-carousel__slide--pinned" />
						</div>
					) : null}
					<div
						className={`demo-carousel__scroller${
							variant === 'spotlight-dots' ? ' demo-carousel__scroller--spotlight' : ''
						}${pinnedPane ? ' demo-carousel__scroller--rail' : ''}`}
					>
						{ssrSlides.map((slide, index) => (
							<SlideCard
								key={`${slide.title}-${index}`}
								slide={slide}
								index={index}
								cardClassName={variant === 'spotlight-dots' && index === 0 ? 'is-current' : ''}
							/>
						))}
					</div>
				</div>
			</div>
			{options.showDots && scrollSlides.length > 1 ? (
				<div className="demo-carousel__dots" aria-label="Carousel pagination">
					{scrollSlides.map((slide, index) => (
						<button
							key={`${slide.title}-dot`}
							type="button"
							className="demo-carousel__dot"
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
