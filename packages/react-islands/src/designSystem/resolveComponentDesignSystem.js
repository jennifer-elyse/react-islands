const joinClassNames = (...values) => values.filter(Boolean).join(' ');

const mergeStyles = (...styles) => {
	const merged = Object.assign({}, ...styles.filter(Boolean));
	return Object.keys(merged).length ? merged : undefined;
};

const varsToStyles = (...vars) => {
	const merged = Object.assign({}, ...vars.filter(Boolean));
	const entries = Object.entries(merged).filter(([, value]) => value !== undefined && value !== null && value !== '');
	if (!entries.length) return undefined;
	return Object.fromEntries(
		entries.map(([key, value]) => [key.startsWith('--') ? key : `--${key}`, value]),
	);
};

export const resolveComponentDesignSystem = ({
	componentName,
	designSystem,
	className,
	style,
	vars,
	defaultClassName = '',
	defaultAttrs = {},
	defaultVars,
}) => {
	const globalConfig = designSystem?.components?.all || {};
	const componentConfig = designSystem?.components?.[componentName] || {};
	const attrs = {
		...(designSystem?.attrs || {}),
		...(globalConfig.attrs || {}),
		...(componentConfig.attrs || {}),
		...defaultAttrs,
	};

	if (designSystem?.name && !attrs['data-design-system']) {
		attrs['data-design-system'] = designSystem.name;
	}

	if (!attrs['data-design-component']) {
		attrs['data-design-component'] = componentName;
	}

	return {
		className: joinClassNames(
			defaultClassName,
			designSystem?.className,
			globalConfig.className,
			componentConfig.className,
			className,
		),
		style: mergeStyles(
			varsToStyles(designSystem?.vars, globalConfig.vars, componentConfig.vars, defaultVars, vars),
			designSystem?.style,
			globalConfig.style,
			componentConfig.style,
			style,
		),
		attrs,
	};
};
