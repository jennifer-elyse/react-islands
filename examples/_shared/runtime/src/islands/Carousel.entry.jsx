'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';

const cx = (...values) => values.filter(Boolean).join(' ');

const useSlideCount = (slides, variant, freezeFirstFrame) =>
	useMemo(() => {
		if (variant === 'pin-first-marquee' && freezeFirstFrame) return slides.slice(1);
		return slides;
	}, [freezeFirstFrame, slides, variant]);

const getSlideElements = (scroller) => Array.from(scroller?.querySelectorAll('[data-carousel-slide]') || []);

const scrollToSlide = (scroller, nextIndex) => {
	const slides = getSlideElements(scroller);
	const target = slides[nextIndex];
	if (!target) return;

	scroller.scrollTo({
		left: target.offsetLeft - scroller.offsetLeft,
		behavior: 'smooth',
	});
};

const useCarouselState = ({ count, autoPlayMs, pauseOnHover, enabledDots, scrollerRef }) => {
	const [index, setIndex] = useState(0);
	const [paused, setPaused] = useState(false);

	useEffect(() => {
		const scroller = scrollerRef.current;
		if (!scroller || count <= 1) return undefined;

		const slides = getSlideElements(scroller);
		if (!slides.length) return undefined;

		const observer = new IntersectionObserver(
			(entries) => {
				const current = entries
					.filter((entry) => entry.isIntersecting)
					.sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
				if (!current) return;
				const nextIndex = Number(current.target.getAttribute('data-carousel-index'));
				if (Number.isFinite(nextIndex)) setIndex(nextIndex);
			},
			{
				root: scroller,
				threshold: [0.6, 0.9],
			},
		);

		slides.forEach((slide) => observer.observe(slide));
		return () => observer.disconnect();
	}, [count, scrollerRef]);

	useEffect(() => {
		if (!enabledDots || count <= 1 || autoPlayMs <= 0 || paused) return undefined;
		const timer = window.setInterval(() => {
			const nextIndex = (index + 1) % count;
			scrollToSlide(scrollerRef.current, nextIndex);
		}, autoPlayMs);

		return () => window.clearInterval(timer);
	}, [autoPlayMs, count, enabledDots, index, paused, scrollerRef]);

	return {
		index,
		paused,
		setPaused: pauseOnHover ? setPaused : () => {},
	};
};

const SlideCard = ({ slide, index, cardClassName }) => (
	<article
		className={cx('demo-carousel__slide', cardClassName)}
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

const Carousel = ({
	title,
	slides = [],
	variant = 'peek-strip',
	options = {},
	accentIconSrc,
}) => {
	const {
		autoPlayMs = 3200,
		showDots = false,
		showArrows = true,
		pauseOnHover = true,
		freezeFirstFrame = false,
	} = options;

	const spotlight = variant === 'spotlight-dots';
	const pinnedPane = variant === 'pin-first-marquee' && freezeFirstFrame;
	const pinnedSlide = pinnedPane ? slides[0] : null;
	const scrollSlides = useSlideCount(slides, variant, freezeFirstFrame);
	const scrollerRef = useRef(null);
	const count = scrollSlides.length;
	const { index, paused, setPaused } = useCarouselState({
		count,
		autoPlayMs,
		pauseOnHover,
		enabledDots: spotlight,
		scrollerRef,
	});

	if (!slides.length) return null;

	const goPrev = () => {
		if (count <= 1) return;
		scrollToSlide(scrollerRef.current, (index - 1 + count) % count);
	};

	const goNext = () => {
		if (count <= 1) return;
		scrollToSlide(scrollerRef.current, (index + 1) % count);
	};

	return (
		<div
			className={cx('demo-carousel', `demo-carousel--${variant}`, paused && 'is-paused')}
			onMouseEnter={pauseOnHover ? () => setPaused(true) : undefined}
			onMouseLeave={pauseOnHover ? () => setPaused(false) : undefined}
		>
			<div className="demo-carousel__header">
				<h2 className="demo-carousel__title">{title}</h2>
				{showArrows && count > 0 ? (
					<div className="demo-carousel__controls">
						<button type="button" className="demo-carousel__control" onClick={goPrev} aria-label="Previous slide">
							<span aria-hidden="true">‹</span>
						</button>
						<button type="button" className="demo-carousel__control" onClick={goNext} aria-label="Next slide">
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

				<div className={cx('demo-carousel__layout', pinnedPane && 'demo-carousel__layout--pinned')}>
					{pinnedSlide ? (
						<div className="demo-carousel__pinned">
							<SlideCard slide={pinnedSlide} index={0} cardClassName="demo-carousel__slide--pinned" />
						</div>
					) : null}

					<div
						ref={scrollerRef}
						className={cx(
							'demo-carousel__scroller',
							spotlight && 'demo-carousel__scroller--spotlight',
							pinnedPane && 'demo-carousel__scroller--rail',
						)}
					>
						{scrollSlides.map((slide, slideIndex) => (
							<SlideCard
								key={`${slide.title}-${slideIndex}`}
								slide={slide}
								index={slideIndex}
								cardClassName={cx(
									`demo-carousel__slide--${variant}`,
									spotlight && slideIndex === index && 'is-current',
								)}
							/>
						))}
					</div>
				</div>
			</div>
			{showDots && count > 1 ? (
				<div className="demo-carousel__dots" aria-label="Carousel pagination">
					{scrollSlides.map((slide, slideIndex) => (
						<button
							key={`${slide.title}-dot`}
							type="button"
							className="demo-carousel__dot"
							data-active={slideIndex === index ? 'true' : 'false'}
							aria-label={`Go to slide ${slideIndex + 1}`}
							onClick={() => scrollToSlide(scrollerRef.current, slideIndex)}
						/>
					))}
				</div>
			) : null}
		</div>
	);
};

export default Carousel;
