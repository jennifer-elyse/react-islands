export const registerServiceWorker = async () => {
	if (!('serviceWorker' in navigator)) return;

	try {
		await navigator.serviceWorker.register('/sw.js', { scope: '/' });
	} catch {
		// ignore
	}
};

registerServiceWorker();
