import React from 'react';
import { Island, resolveIslandModule } from 'react-islands-runtime/ssr';
import { resolveComponentDesignSystem } from '../designSystem/resolveComponentDesignSystem.js';

import CarouselSSR from '../carousel/Carousel.ssr.jsx';

export const CarouselBlock = ({
	block,
	className,
	style,
	islandKey = 'carousel',
	hydrate = 'immediate',
	renderStrategy = 'replace',
	resolveModule = resolveIslandModule,
	designSystem,
}) => {
	const rootDesign = resolveComponentDesignSystem({
		componentName: 'carouselBlock',
		designSystem,
		className,
		style,
	});
	const islandProps = designSystem ? { ...block, designSystem } : block;

	return (
		<section className={rootDesign.className} style={rootDesign.style} {...rootDesign.attrs}>
			<Island
				islandKey={islandKey}
				hydrate={hydrate}
				renderStrategy={renderStrategy}
				props={islandProps}
				resolveIslandModule={resolveModule}
			>
				<CarouselSSR {...block} designSystem={designSystem} />
			</Island>
		</section>
	);
};
