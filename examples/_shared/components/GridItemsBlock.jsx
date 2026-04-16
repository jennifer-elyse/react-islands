import React from 'react';

export const GridItemsBlock = ({ block, className, style }) => {
	const items = Array.isArray(block?.items) ? block.items.filter(Boolean) : [];
	if (!items.length) return null;
	const hasOddLayout = items.length > 1 && items.length % 2 === 1;

	return (
		<section
			className={['grid-items', className].filter(Boolean).join(' ')}
			data-grid-items-layout={hasOddLayout ? 'feature-first' : 'even'}
			style={style}
		>
			<div className="grid-items__header">
				<h2 className="grid-items__title">{block?.title || 'Featured Items'}</h2>
				{block?.href ? (
					<a className="grid-items__link" href={block.href}>
						{block?.hrefLabel || 'View all'}
					</a>
				) : null}
			</div>

			<div className="grid-items__layout">
				{items.map((item, index) => {
					const cardClassName = [
						'grid-items__card',
						hasOddLayout && index === 0 ? 'grid-items__card--feature' : 'grid-items__card--supporting',
					]
						.filter(Boolean)
						.join(' ');
					const metaItems = Array.isArray(item?.meta) ? item.meta.filter(Boolean) : [];
					const [primaryMeta, ...secondaryMeta] = metaItems;

					const content = (
						<>
							{item?.image || item?.fallbackImage ? (
								<div className="grid-items__media">
									<img
										src={item.image || item.fallbackImage}
										alt={item?.imageAlt || item?.title || ''}
										onError={(event) => {
											const fallbackSrc = item?.fallbackImage;
											if (!fallbackSrc) return;
											if (event.currentTarget.src.endsWith(fallbackSrc)) return;
											event.currentTarget.src = fallbackSrc;
										}}
									/>
								</div>
							) : null}
							<div className="grid-items__content">
								{item?.eyebrow ? <div className="grid-items__eyebrow">{item.eyebrow}</div> : null}
								{primaryMeta ? <div className="grid-items__price">{primaryMeta}</div> : null}
								<h3 className="grid-items__item-title">{item?.title || 'Untitled item'}</h3>
								{secondaryMeta.length ? (
									<div className="grid-items__meta">
										{secondaryMeta.map((entry) => (
											<div key={`${item.title}-${entry}`} className="grid-items__meta-line">
												{entry}
											</div>
										))}
									</div>
								) : null}
							</div>
						</>
					);

					return item?.href ? (
						<a key={`${item?.title || 'item'}-${index}`} className={cardClassName} href={item.href}>
							{content}
						</a>
					) : (
						<article key={`${item?.title || 'item'}-${index}`} className={cardClassName}>
							{content}
						</article>
					);
				})}
			</div>
		</section>
	);
};
