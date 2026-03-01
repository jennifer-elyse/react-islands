export const cspMiddleware = (req, res, next) => {
	const isDev = process.env.NODE_ENV !== 'production';
	const devOrigin = isDev ? process.env.ASSETS_ORIGIN || 'http://localhost:5173' : '';
	const devWsOrigin = isDev ? devOrigin.replace(/^http/, 'ws') : '';

	const directives = [
		"default-src 'self'",
		"base-uri 'self'",
		"object-src 'none'",
		"frame-ancestors 'none'",
		`script-src 'self'${isDev ? ` ${devOrigin} 'unsafe-inline' 'unsafe-eval'` : ''}`,
		"style-src 'self' 'unsafe-inline'",
		"img-src 'self' data: https:",
		"font-src 'self' data:",
		`connect-src 'self' https:${isDev ? ` ${devOrigin} ${devWsOrigin}` : ''}`,
		"manifest-src 'self'",
		"worker-src 'self'",
	];

	res.setHeader('Content-Security-Policy', directives.join('; '));
	res.setHeader('X-Content-Type-Options', 'nosniff');
	res.setHeader('Referrer-Policy', 'no-referrer');
	res.setHeader('X-Frame-Options', 'DENY');
	res.setHeader('X-XSS-Protection', '0');
	if (!isDev) {
		res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
	}

	next();
};
