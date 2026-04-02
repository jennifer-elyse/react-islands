import * as React from 'react';

export type HydrateMode = 'visible' | 'idle' | 'interaction' | 'immediate';
export type HeadTag = Record<string, string>;
export type ThemeTokens = Record<string, unknown>;

export interface DocumentStyleEntry {
	id?: string;
	media?: string;
	cssText: string;
}

export interface DocumentProps {
	htmlAttrs?: Record<string, string>;
	bodyAttrs?: Record<string, string>;
	meta?: HeadTag[];
	links?: HeadTag[];
	styles?: DocumentStyleEntry[];
	headPrefix?: React.ReactNode[];
	headSuffix?: React.ReactNode[];
}

export interface ThemeDefinition {
	name?: string;
	colorScheme?: 'light' | 'dark' | (string & {});
	themeColor?: string;
	tokens?: ThemeTokens;
	documentProps?: DocumentProps;
}

export interface CssService {
	addInlineCss(
		cssText: string,
		options?: { key?: string; id?: string; media?: string },
	): { key?: string | null; cssText: string; media?: string | null; id?: string | null };
	addStylesheet(
		href: string,
		options?: { rel?: string; media?: string; crossOrigin?: string; referrerPolicy?: string },
	): {
		rel: string;
		href: string;
		media?: string | null;
		crossOrigin?: string | null;
		referrerPolicy?: string | null;
	};
	setTheme(
		theme: ThemeDefinition,
		options?: { selector?: string; variablePrefix?: string; styleKey?: string; styleId?: string },
	): ThemeDefinition;
	extendDocumentProps(documentProps: DocumentProps): void;
	toDocumentProps(): DocumentProps;
}

export interface RenderRequestContext {
	req: any;
	res?: any;
	params: Record<string, string>;
	css?: CssService;
	theme?: ThemeDefinition | null;
	[key: string]: unknown;
}

export interface RenderFeatureHookArgs {
	req: any;
	res?: any;
	match: any;
}

export interface RenderFeatureDocumentArgs {
	req: any;
	res?: any;
	match: any;
	props: Record<string, unknown>;
	head: { title?: string | null; meta?: HeadTag[]; links?: HeadTag[] };
	context: Record<string, unknown>;
}

export interface RenderFeature {
	name?: string;
	extendRequestContext?(args: RenderFeatureHookArgs): Record<string, unknown> | void;
	getDocumentProps?(args: RenderFeatureDocumentArgs): DocumentProps | void;
}

export interface DomainThemeFeatureOptions {
	resolveTheme(req: any, match?: any): ThemeDefinition | null | undefined;
	selector?: string;
	variablePrefix?: string;
	cssServiceFactory?: () => CssService;
}

export function createRenderRequest(options: {
	HtmlDocument: React.ComponentType<any>;
	resolveIslandModule?: (islandKey: string) => string | null | undefined;
	getAllIslandModuleSpecifiers: () => string[];
	devOrigin?: string;
	manifestPath?: string;
	features?: RenderFeature[];
	getDocumentProps?: (args: RenderFeatureDocumentArgs) => DocumentProps | void;
}): (args: { req: any; res: any; router: { match(pathname: string): any } }) => Promise<void>;

export function renderPage(options: {
	req: any;
	res: any;
	appElement: React.ReactNode;
	head?: { title?: string; meta?: HeadTag[]; links?: HeadTag[] };
	documentProps?: DocumentProps;
}): Promise<void>;

export function createCssService(): CssService;
export function mergeDocumentProps(base?: DocumentProps, next?: DocumentProps): DocumentProps;
export function flattenTokensToCssVars(
	tokens: Record<string, unknown>,
	opts?: { prefix?: string },
): Record<string, string>;
export function tokensToCssText(tokens: Record<string, unknown>, opts?: { selector?: string; prefix?: string }): string;
export function createDomainThemeFeature(options: DomainThemeFeatureOptions): RenderFeature;
export function defineTheme<T extends ThemeDefinition>(theme: T): T;
export function defineThemes<T extends Record<string, ThemeDefinition>>(themes: T): T;

export function createManifestProvider(...args: any[]): any;
export function buildIslandsManifest(...args: any[]): any;
export function cspMiddleware(...args: any[]): any;
export function createFileRouter(...args: any[]): Promise<any>;
export function loadAndCompose(...args: any[]): Promise<any>;
export function Island(props: {
	islandKey: string;
	hydrate?: HydrateMode;
	props?: any;
	resolveIslandModule: (islandKey: string) => string | null | undefined;
	children?: React.ReactNode;
}): React.ReactElement | null;
export function resolveIslandModule(...args: any[]): any;
