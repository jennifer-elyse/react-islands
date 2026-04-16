'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';

const cx = (...values) => values.filter(Boolean).join(' ');

const useSlideCount = (slides, variant, freezeFirstFrame) =>
	useMemo(() => {
		if (variant === 'pin-first-marquee' && freezeFirstFrame) return slides.slice(1);
		return slides;
	}, [freezeFirstFrame, slides, variant]);

const getSlideElements = (scroller) => Array.from(scroller?.querySelectorAll('[data-carousel-slide]') || []);

const getSnapPaddingStart = (scroller) => {
	if (!scroller || typeof window === 'undefined') return 0;
	const scrollerStyles = window.getComputedStyle(scroller);
	return Number.parseFloat(scrollerStyles.paddingInlineStart || '0') || 0;
};

const getMaxScrollLeft = (scroller) => Math.max(0, (scroller?.scrollWidth || 0) - (scroller?.clientWidth || 0));

const getTargetScrollLeft = (scroller, slide) => {
	if (!scroller || !slide) return 0;
	const paddingStart = getSnapPaddingStart(scroller);
	return Math.min(getMaxScrollLeft(scroller), Math.max(0, slide.offsetLeft - paddingStart));
};

const getNearestSlideIndex = (scroller) => {
	const slides = getSlideElements(scroller);
	if (!slides.length) return 0;

	let nearestIndex = 0;
	let nearestDistance = Number.POSITIVE_INFINITY;

	for (const slide of slides) {
		const slideIndex = Number(slide.getAttribute('data-carousel-index'));
		if (!Number.isFinite(slideIndex)) continue;

		const targetLeft = getTargetScrollLeft(scroller, slide);
		const distance = Math.abs(scroller.scrollLeft - targetLeft);
		if (distance < nearestDistance) {
			nearestDistance = distance;
			nearestIndex = slideIndex;
		}
	}

	return nearestIndex;
};

const scrollToSlide = (scroller, nextIndex) => {
	const slides = getSlideElements(scroller);
	const target = slides[nextIndex];
	if (!target) return;

	scroller.scrollTo({
		left: getTargetScrollLeft(scroller, target),
		behavior: 'smooth',
	});
};

const useCarouselState = ({ count, autoPlayMs, pauseOnHover, enabledDots, scrollerRef }) => {
	const [index, setIndex] = useState(0);
	const [paused, setPaused] = useState(false);
	const [hasOverflow, setHasOverflow] = useState(() => count > 1);

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

	useEffect(() => {
		const scroller = scrollerRef.current;
		if (!scroller || count <= 1) {
			setHasOverflow(false);
			return undefined;
		}

		const updateOverflow = () => {
			setHasOverflow(scroller.scrollWidth - scroller.clientWidth > 1);
		};

		updateOverflow();

		if (typeof ResizeObserver === 'undefined') {
			window.addEventListener('resize', updateOverflow);
			return () => window.removeEventListener('resize', updateOverflow);
		}

		const observer = new ResizeObserver(updateOverflow);
		observer.observe(scroller);
		Array.from(scroller.children).forEach((child) => observer.observe(child));

		return () => observer.disconnect();
	}, [count, scrollerRef]);

	useEffect(() => {
		const scroller = scrollerRef.current;
		if (!scroller) return undefined;

		let isDragging = false;
		let startX = 0;
		let startScrollLeft = 0;

		const handlePointerDown = (event) => {
			if (event.pointerType === 'mouse' && event.button !== 0) return;
			isDragging = true;
			startX = event.clientX;
			startScrollLeft = scroller.scrollLeft;
			scroller.setPointerCapture?.(event.pointerId);
			scroller.classList.add('is-dragging');
		};

		const handlePointerMove = (event) => {
			if (!isDragging) return;
			const delta = event.clientX - startX;
			scroller.scrollLeft = startScrollLeft - delta;
		};

		const handlePointerEnd = (event) => {
			if (!isDragging) return;
			isDragging = false;
			scroller.releasePointerCapture?.(event.pointerId);
			scroller.classList.remove('is-dragging');
			scrollToSlide(scroller, getNearestSlideIndex(scroller));
		};

		scroller.addEventListener('pointerdown', handlePointerDown);
		scroller.addEventListener('pointermove', handlePointerMove);
		scroller.addEventListener('pointerup', handlePointerEnd);
		scroller.addEventListener('pointercancel', handlePointerEnd);
		scroller.addEventListener('lostpointercapture', handlePointerEnd);

		return () => {
			scroller.removeEventListener('pointerdown', handlePointerDown);
			scroller.removeEventListener('pointermove', handlePointerMove);
			scroller.removeEventListener('pointerup', handlePointerEnd);
			scroller.removeEventListener('pointercancel', handlePointerEnd);
			scroller.removeEventListener('lostpointercapture', handlePointerEnd);
		};
	}, [scrollerRef]);

	return {
		index,
		paused,
		hasOverflow,
		setPaused: pauseOnHover ? setPaused : () => {},
	};
};

const SlideCard = ({ slide, index, cardClassName }) => (
	<article className={cx('demo-carousel__slide', cardClassName)} data-carousel-slide="" data-carousel-index={index}>
		<div className="demo-carousel__media">
			<img src={slide.image} alt={slide.title} draggable="false" />
		</div>
		<div className="demo-carousel__copy">
			{slide.eyebrow ? <span className="demo-carousel__eyebrow">{slide.eyebrow}</span> : null}
			<h3 className="demo-carousel__slide-title">{slide.title}</h3>
			<p className="demo-carousel__slide-body">{slide.body}</p>
		</div>
	</article>
);

const Carousel = ({ title, slides = [], variant = 'peek-strip', options = {}, accentIconSrc }) => {
	const {
		autoPlayMs = 3200,
		showDots = false,
		showArrows = true,
		loopNavButtons = true,
		pauseOnHover = true,
		freezeFirstFrame = false,
	} = options;

	const spotlight = variant === 'spotlight-dots';
	const pinnedPane = variant === 'pin-first-marquee' && freezeFirstFrame;
	const pinnedSlide = pinnedPane ? slides[0] : null;
	const scrollSlides = useSlideCount(slides, variant, freezeFirstFrame);
	const scrollerRef = useRef(null);
	const count = scrollSlides.length;
	const { index, paused, hasOverflow, setPaused } = useCarouselState({
		count,
		autoPlayMs,
		pauseOnHover,
		enabledDots: spotlight,
		scrollerRef,
	});

	if (!slides.length) return null;

	const canGoPrev = loopNavButtons ? count > 1 : index > 0;
	const canGoNext = loopNavButtons ? count > 1 : index < count - 1;

	const goPrev = () => {
		const scroller = scrollerRef.current;
		if (!scroller || !canGoPrev) return;

		const currentIndex = getNearestSlideIndex(scroller);
		const nextIndex = loopNavButtons ? (currentIndex - 1 + count) % count : Math.max(0, currentIndex - 1);
		scrollToSlide(scroller, nextIndex);
	};

	const goNext = () => {
		const scroller = scrollerRef.current;
		if (!scroller || !canGoNext) return;

		const currentIndex = getNearestSlideIndex(scroller);
		const nextIndex = loopNavButtons ? (currentIndex + 1) % count : Math.min(count - 1, currentIndex + 1);
		scrollToSlide(scroller, nextIndex);
	};

	return (
		<div
			className={cx('demo-carousel', `demo-carousel--${variant}`, paused && 'is-paused')}
			onMouseEnter={pauseOnHover ? () => setPaused(true) : undefined}
			onMouseLeave={pauseOnHover ? () => setPaused(false) : undefined}
		>
			<div className="demo-carousel__header">
				<h2 className="demo-carousel__title">{title}</h2>
				{showArrows && count > 1 && hasOverflow ? (
					<div className="demo-carousel__controls">
						<button
							type="button"
							className="demo-carousel__control"
							onClick={goPrev}
							disabled={count <= 1}
							aria-label="Previous slide"
						>
							<span aria-hidden="true">‹</span>
						</button>
						<button
							type="button"
							className="demo-carousel__control"
							onClick={goNext}
							disabled={count <= 1}
							aria-label="Next slide"
						>
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
