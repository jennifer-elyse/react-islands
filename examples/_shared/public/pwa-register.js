export const registerServiceWorker = async () => {
	if (!('serviceWorker' in navigator)) return;
	const host = window.location.hostname;
	const isLocalhost = host === 'localhost' || host === '127.0.0.1' || host === '::1';
	if (isLocalhost) return;

	try {
		await navigator.serviceWorker.register('/sw.js', { scope: '/' });
	} catch {
		// ignore
	}
};

registerServiceWorker();
