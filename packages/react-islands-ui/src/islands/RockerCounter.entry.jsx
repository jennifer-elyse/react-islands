'use client';

import React, { useState } from 'react';

const shellStyle = {
	display: 'inline-flex',
	alignItems: 'center',
	gap: '0.75rem',
	padding: '0.35rem',
	borderRadius: '999px',
	border: '1px solid color-mix(in oklab, var(--border-subtle, #8d95a3) 78%, white)',
	background:
		'linear-gradient(180deg, color-mix(in oklab, var(--surface-panel, #ffffff) 92%, white), color-mix(in oklab, var(--surface-panel, #ffffff) 82%, black 4%))',
	boxShadow: '0 10px 30px color-mix(in oklab, var(--surface-shadow, #0b1220) 18%, transparent)',
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
	background: 'transparent',
	cursor: 'pointer',
	transition: 'transform 140ms ease, background-color 140ms ease',
};

const activeButtonStyle = {
	background: 'var(--surface-panel, #ffffff)',
	boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.7), 0 6px 14px rgba(15,23,42,0.14)',
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

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const RockerCounter = ({ initialValue = 0, min = 0, max = 99, step = 1, label = 'Count' }) => {
	const [value, setValue] = useState(() => clamp(initialValue, min, max));

	const decrement = () => setValue((current) => clamp(current - step, min, max));
	const increment = () => setValue((current) => clamp(current + step, min, max));

	return (
		<div style={shellStyle}>
			<div style={rockerStyle} role="group" aria-label={`${label} controls`}>
				<button
					type="button"
					style={{ ...buttonStyle, ...(value > min ? activeButtonStyle : null) }}
					onClick={decrement}
					aria-label={`Decrease ${label}`}
					disabled={value <= min}
				>
					-
				</button>
				<button
					type="button"
					style={{ ...buttonStyle, ...(value < max ? activeButtonStyle : null) }}
					onClick={increment}
					aria-label={`Increase ${label}`}
					disabled={value >= max}
				>
					+
				</button>
			</div>
			<div style={valueStyle} aria-live="polite">
				<span style={valueNumberStyle}>{value}</span>
				<span style={labelStyle}>{label}</span>
			</div>
		</div>
	);
};

export default RockerCounter;
