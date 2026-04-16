import React from 'react';
import { Island, resolveIslandModule } from 'react-islands-runtime/ssr';

import CarouselSSR from '../runtime/src/islands/Carousel.ssr.jsx';

export const CarouselBlock = ({ block, className, style }) => {
	return (
		<section className={className} style={style}>
			<Island
				islandKey="carousel"
				hydrate="immediate"
				renderStrategy="replace"
				props={block}
				resolveIslandModule={resolveIslandModule}
			>
				<CarouselSSR {...block} />
			</Island>
		</section>
	);
};
