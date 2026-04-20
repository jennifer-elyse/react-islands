import * as React from 'react';

export type HydrateMode = 'visible' | 'idle' | 'interaction' | 'immediate';
export type HtmlAttrValue = string;
export type HeadTag = Record<string, string>;
export type RouteParams = Record<string, string>;
export type ThemeTokenValue = string | number | boolean | null | undefined;
export type ThemeTokens = {
	[key: string]: ThemeTokenValue | ThemeTokens | Array<ThemeTokenValue | ThemeTokens>;
};

export interface DocumentStyleEntry {
	id?: string;
	media?: string;
	cssText: string;
}

export interface DocumentProps {
	htmlAttrs?: Record<string, HtmlAttrValue>;
	bodyAttrs?: Record<string, HtmlAttrValue>;
	meta?: HeadTag[];
	links?: HeadTag[];
	styles?: DocumentStyleEntry[];
	headPrefix?: React.ReactNode[];
	headSuffix?: React.ReactNode[];
}

export interface HeadDefinition {
	title?: string | null;
	meta?: HeadTag[];
	links?: HeadTag[];
}

export interface ThemeDefinition {
	name?: string;
	colorScheme?: 'light' | 'dark' | (string & {});
	themeColor?: string;
	tokens?: ThemeTokens;
	documentProps?: DocumentProps;
	defaultMode?: string;
	modes?: Record<string, ThemeModeDefinition>;
}

export interface ThemeModeDefinition {
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
	req: unknown;
	res?: unknown;
	params: RouteParams;
	css?: CssService;
	theme?: ThemeDefinition | null;
	[key: string]: unknown;
}

export interface RouteMatch<
	TPage extends PageModule<any, any> = PageModule<any, any>,
	TLayout extends LayoutModule<any, any> = LayoutModule<any, any>,
> {
	params: RouteParams;
	page: TPage;
	layouts: TLayout[];
	pattern?: string;
}

export interface RenderFeatureHookArgs {
	req: unknown;
	res?: unknown;
	match: RouteMatch;
}

export interface RenderFeatureDocumentArgs<
	TProps extends Record<string, unknown> = Record<string, unknown>,
	TContext extends Record<string, unknown> = Record<string, unknown>,
> {
	req: unknown;
	res?: unknown;
	match: RouteMatch;
	props: TProps;
	head: HeadDefinition;
	context: TContext;
}

export interface RenderFeature<
	TContextExtension extends Record<string, unknown> = Record<string, unknown>,
	TProps extends Record<string, unknown> = Record<string, unknown>,
	TContext extends Record<string, unknown> = RenderRequestContext & TContextExtension,
> {
	name?: string;
	extendRequestContext?(args: RenderFeatureHookArgs): TContextExtension | void | Promise<TContextExtension | void>;
	getDocumentProps?(args: RenderFeatureDocumentArgs<TProps, TContext>): DocumentProps | void | Promise<DocumentProps | void>;
}

export interface DomainThemeFeatureOptions {
	resolveTheme(req: unknown, match?: RouteMatch): ThemeDefinition | null | undefined;
	selector?: string;
	variablePrefix?: string;
	cssServiceFactory?: () => CssService;
}

export interface ThemeModeFeatureOptions {
	attribute?: string;
	preferenceAttribute?: string;
	storageKey?: string;
	cookieName?: string;
	allowedModes?: string[];
	allowAuto?: boolean;
	fallbackMode?: string;
	defaultPreference?: string;
	themeColors?: Record<string, string>;
}

export interface DesignSystemDefinition {
	theme?: ThemeDefinition;
	resolveTheme?: DomainThemeFeatureOptions['resolveTheme'];
	selector?: string;
	variablePrefix?: string;
	cssServiceFactory?: () => CssService;
	mode?: false | ThemeModeFeatureOptions;
}

export interface CreatedDesignSystem extends DesignSystemDefinition {
	features: RenderFeature[];
}

export type RouteLoaderResult<TProps extends Record<string, unknown>> = TProps | void | Promise<TProps | void>;

export type RouteLoader<
	TProps extends Record<string, unknown> = Record<string, unknown>,
	TContext extends Record<string, unknown> = RenderRequestContext,
> = (context: TContext) => RouteLoaderResult<TProps>;

export type RouteHead<
	TProps extends Record<string, unknown> = Record<string, unknown>,
	TContext extends Record<string, unknown> = RenderRequestContext,
> = (props: TProps, context: TContext) => HeadDefinition | void | Promise<HeadDefinition | void>;

export interface PageModule<
	TProps extends Record<string, unknown> = Record<string, unknown>,
	TContext extends Record<string, unknown> = RenderRequestContext,
> {
	loader?: RouteLoader<TProps, TContext>;
	head?: RouteHead<TProps, TContext>;
	Page: React.ComponentType<TProps & { req?: unknown }>;
}

export interface LayoutModule<
	TProps extends Record<string, unknown> = Record<string, unknown>,
	TContext extends Record<string, unknown> = RenderRequestContext,
> {
	loader?: RouteLoader<TProps, TContext>;
	head?: RouteHead<TProps, TContext>;
	Layout: React.ComponentType<React.PropsWithChildren<TProps & { req?: unknown }>>;
}

export interface FileRouter {
	match(pathname: string): RouteMatch | null;
	routes: string[];
}

export interface CreateRenderRequestOptions<
	TProps extends Record<string, unknown> = Record<string, unknown>,
	TContext extends Record<string, unknown> = RenderRequestContext,
> {
	HtmlDocument: React.ComponentType<any>;
	resolveIslandModule?: ResolveIslandModule;
	getAllIslandModuleSpecifiers: () => string[];
	devOrigin?: string;
	manifestPath?: string;
	features?: RenderFeature<any, TProps, TContext>[];
	getDocumentProps?: (args: RenderFeatureDocumentArgs<TProps, TContext>) => DocumentProps | void | Promise<DocumentProps | void>;
}

export interface LoadAndComposeOptions {
	req: unknown;
	params: RouteParams;
	layouts: LayoutModule[];
	route: PageModule;
	features?: RenderFeature[];
	getDocumentProps?: (args: RenderFeatureDocumentArgs) => DocumentProps | void | Promise<DocumentProps | void>;
}

export interface LoadAndComposeResult<
	TProps extends Record<string, unknown> = Record<string, unknown>,
	TContext extends Record<string, unknown> = RenderRequestContext,
> {
	element: React.ReactElement;
	props: TProps;
	head: HeadDefinition;
	documentProps: DocumentProps;
	context: TContext;
}

export interface ManifestProvider {
	mode: 'dev' | 'prod';
	getManifest(): Record<string, unknown>;
	getManifestJson(): string;
	getManifestIntegrity(): string | null;
}

export interface ResolveIslandModule {
	(islandKey: string): string | null | undefined;
}

export interface IslandProps<TProps = unknown> {
	islandKey: string;
	hydrate?: HydrateMode;
	renderStrategy?: 'hydrate' | 'replace';
	props?: TProps;
	resolveIslandModule: ResolveIslandModule;
	children?: React.ReactNode;
}

export function createRenderRequest<
	TProps extends Record<string, unknown> = Record<string, unknown>,
	TContext extends Record<string, unknown> = RenderRequestContext,
>(options: CreateRenderRequestOptions<TProps, TContext>): (args: {
	req: { path: string } & Record<string, unknown>;
	res: unknown;
	router: FileRouter;
}) => Promise<void>;

export function renderPage(options: {
	req: unknown;
	res: unknown;
	appElement: React.ReactNode;
	head?: HeadDefinition;
	documentProps?: DocumentProps;
}): Promise<void>;

export function createCssService(): CssService;
export function mergeDocumentProps(base?: DocumentProps, next?: DocumentProps): DocumentProps;
export function flattenTokensToCssVars(tokens: Record<string, unknown>, opts?: { prefix?: string }): Record<string, string>;
export function tokensToCssText(tokens: Record<string, unknown>, opts?: { selector?: string; prefix?: string }): string;
export function createDomainThemeFeature(options: DomainThemeFeatureOptions): RenderFeature<{ css: CssService; theme: ThemeDefinition | null }>;
export function defineTheme<T extends ThemeDefinition>(theme: T): T;
export function defineThemes<T extends Record<string, ThemeDefinition>>(themes: T): T;
export function createThemeModeFeature(options?: ThemeModeFeatureOptions): RenderFeature;
export function defineDesignSystem<T extends DesignSystemDefinition>(designSystem: T): T;
export function createDesignSystemFeatures(
	input: ThemeDefinition | DesignSystemDefinition,
	overrides?: Partial<DesignSystemDefinition>,
): RenderFeature[];
export function createDesignSystem(
	input: ThemeDefinition | DesignSystemDefinition,
	overrides?: Partial<DesignSystemDefinition>,
): CreatedDesignSystem;

export function createManifestProvider(options: {
	mode: 'dev' | 'prod';
	devModules?: Record<string, string>;
	manifestPath?: string;
	runtimeDevSrc?: string;
	includeIntegrity?: boolean;
	extraManifestFields?: Record<string, unknown>;
}): ManifestProvider;
export function buildIslandsManifest(options: { viteManifestPath: string; outPath: string }): {
	modules: Record<string, string>;
	'islands-runtime': string;
};
export function cspMiddleware(req: unknown, res: unknown, next: () => void): void;
export function createFileRouter(options: { routesDir: URL }): Promise<FileRouter>;
export function loadAndCompose<
	TProps extends Record<string, unknown> = Record<string, unknown>,
	TContext extends Record<string, unknown> = RenderRequestContext,
>(options: LoadAndComposeOptions): Promise<LoadAndComposeResult<TProps, TContext>>;
export function Island<TProps = unknown>(props: IslandProps<TProps>): React.ReactElement | null;
export function resolveIslandModule(islandKey: string): string | null | undefined;
