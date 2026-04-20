import React from 'react';
import { resolveComponentDesignSystem } from '../designSystem/resolveComponentDesignSystem.js';

export const PlpProductsBlock = ({ block, className = '', style, designSystem }) => {
	const items = Array.isArray(block?.items) ? block.items.filter(Boolean) : [];
	if (!items.length) return null;
	const rootDesign = resolveComponentDesignSystem({
		componentName: 'plpProductsBlock',
		designSystem,
		className,
		style,
		defaultClassName: 'plp-products',
	});

	return (
		<section className={rootDesign.className} style={rootDesign.style} {...rootDesign.attrs}>
			<div className="plp-products__header">
				<h2 className="plp-products__title">{block?.title || 'Products'}</h2>
				{block?.href ? (
					<a className="plp-products__link" href={block.href}>
						{block?.hrefLabel || 'View all'}
					</a>
				) : null}
			</div>

			<div className="plp-products__layout">
				{items.map((item, index) => {
					const meta = Array.isArray(item?.meta) ? item.meta.filter(Boolean) : [];
					const price = item?.price || meta[0] || null;
					const description = item?.description || meta.slice(1).join(' ') || null;
					const eyebrow = item?.eyebrow || null;
					const href = item?.href || null;
					const needsMoreLink =
						(eyebrow && eyebrow.length > 28) ||
						String(item?.title || '').length > 38 ||
						String(description || '').length > 72;
					const contentSizeClass =
						(eyebrow && eyebrow.length > 36) || String(item?.title || '').length > 54
							? 'plp-products__content--compact'
							: '';
					const titleNode = href ? (
						<a className="plp-products__title-link" href={href}>
							{item?.title || 'Untitled product'}
						</a>
					) : (
						item?.title || 'Untitled product'
					);
					const content = (
						<>
							{item?.image || item?.fallbackImage ? (
								<div className="plp-products__media">
									<img
										src={item.image || item.fallbackImage}
										alt={item?.imageAlt || item?.title || ''}
										loading="lazy"
										decoding="async"
									/>
								</div>
							) : null}
							<div className={['plp-products__content', contentSizeClass].filter(Boolean).join(' ')}>
								{eyebrow ? <div className="plp-products__eyebrow">{eyebrow}</div> : null}
								{price ? <div className="plp-products__price">{price}</div> : null}
								<h3 className="plp-products__item-title">{titleNode}</h3>
								{description ? <div className="plp-products__description">{description}</div> : null}
								{href && needsMoreLink ? (
									<div className="plp-products__actions">
										<a className="plp-products__more" href={href}>
											More
										</a>
									</div>
								) : null}
							</div>
						</>
					);

					return <article key={`${item?.title || 'item'}-${index}`} className="plp-products__card">{content}</article>;
				})}
			</div>
		</section>
	);
};
