import React from 'react';
import { resolveComponentDesignSystem } from '../designSystem/resolveComponentDesignSystem.js';

export const ProductDetailBlock = ({ block, className = '', style, designSystem }) => {
	if (!block) return null;

	const hasImage = Boolean(block?.image || block?.fallbackImage);
	const rootDesign = resolveComponentDesignSystem({
		componentName: 'productDetailBlock',
		designSystem,
		className,
		style,
		defaultClassName: 'product-detail',
	});

	return (
		<section className={rootDesign.className} style={rootDesign.style} {...rootDesign.attrs}>
			<div className="product-detail__layout">
				<div className="product-detail__media-column">
					<div className="product-detail__media-frame">
						{hasImage ? (
							<img
								className="product-detail__image"
								src={block.image || block.fallbackImage}
								alt={block?.imageAlt || block?.title || 'Product'}
								onError={(event) => {
									const fallbackSrc = block?.fallbackImage;
									if (!fallbackSrc) return;
									if (event.currentTarget.src.endsWith(fallbackSrc)) return;
									event.currentTarget.src = fallbackSrc;
								}}
							/>
						) : (
							<div className="product-detail__empty">No image</div>
						)}
					</div>
				</div>

				<div className="product-detail__content">
					<h1 className="product-detail__title">{block?.title || 'Product'}</h1>
					{block?.sku ? <div className="product-detail__sku">SKU: {block.sku}</div> : null}
					{block?.subtitle ? <p className="product-detail__subtitle">{block.subtitle}</p> : null}
					{block?.price ? <div className="product-detail__price">{block.price}</div> : null}
					{block?.description ? <div className="product-detail__description">{block.description}</div> : null}
				</div>
			</div>
		</section>
	);
};
