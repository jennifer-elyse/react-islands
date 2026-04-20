import * as React from 'react';

export function mountIsland(options: {
	el: HTMLElement;
	moduleSpecifier: string;
	props: any;
	manifest: { modules: Record<string, string> };
}): Promise<void>;

export function bootIslands(options?: {
	manifestElId?: string;
	selector?: string;
	onError?: (err: Error, el: HTMLElement, moduleSpecifier: string | null) => void;
	reportEvent?: (payload: { event: string; detail?: object }) => void;
	nearFoldOffsetPx?: number;
	restRootMarginPx?: number;
}): Promise<void>;
