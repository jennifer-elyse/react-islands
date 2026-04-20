import React from 'react';

const shellStyle = {
	display: 'inline-flex',
	alignItems: 'center',
	gap: '0.75rem',
	padding: '0.35rem',
	borderRadius: '999px',
	border: '1px solid color-mix(in oklab, var(--border-subtle, #8d95a3) 78%, white)',
	background:
		'linear-gradient(180deg, color-mix(in oklab, var(--surface-panel, #ffffff) 92%, white), color-mix(in oklab, var(--surface-panel, #ffffff) 82%, black 4%))',
	width: 'fit-content',
};

const rockerStyle = {
	display: 'grid',
	gridTemplateColumns: '1fr 1fr',
	gap: '0.25rem',
	padding: '0.2rem',
	borderRadius: '999px',
	background: 'color-mix(in oklab, var(--surface-muted, #e8edf5) 90%, white)',
};

const buttonStyle = {
	border: 0,
	borderRadius: '999px',
	minWidth: '3rem',
	minHeight: '3rem',
	padding: '0 1rem',
	fontFamily: 'var(--font-ui, inherit)',
	fontSize: '1.2rem',
	fontWeight: 800,
	lineHeight: 1,
	color: 'var(--text-primary, #111827)',
	background: 'var(--surface-panel, #ffffff)',
};

const valueStyle = {
	minWidth: '4.5rem',
	padding: '0 0.6rem',
	textAlign: 'center',
	fontFamily: 'var(--font-ui, inherit)',
};

const valueNumberStyle = {
	display: 'block',
	fontSize: '1.6rem',
	fontWeight: 800,
	lineHeight: 1,
	color: 'var(--text-primary, #111827)',
};

const labelStyle = {
	display: 'block',
	marginTop: '0.2rem',
	fontSize: '0.72rem',
	fontWeight: 700,
	letterSpacing: '0.08em',
	textTransform: 'uppercase',
	color: 'var(--text-muted, #5b6472)',
};

const RockerCounterSSR = ({ initialValue = 0, label = 'Count' }) => (
	<div style={shellStyle}>
		<div style={rockerStyle} aria-hidden="true">
			<span style={buttonStyle}>-</span>
			<span style={buttonStyle}>+</span>
		</div>
		<div style={valueStyle}>
			<span style={valueNumberStyle}>{initialValue}</span>
			<span style={labelStyle}>{label}</span>
		</div>
	</div>
);

export default RockerCounterSSR;
