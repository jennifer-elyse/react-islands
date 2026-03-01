import EventEmitter from 'node:events';

// Simple in-memory event bus for SSE-style updates. This is a lightweight
// placeholder to avoid runtime failures when the service layer is absent.
const bus = new EventEmitter();
bus.setMaxListeners(100);

const connections = new Set();

export const registerConnection = (res) => {
	connections.add(res);
	return () => connections.delete(res);
};

export const removeConnection = (res) => {
	connections.delete(res);
};

export const getBufferedEvents = () => [];

export const startPingInterval = () => {
	const id = setInterval(() => {
		for (const res of connections) {
			try {
				res.write(`event: ping\ndata: {}\n\n`);
			} catch {
				// drop broken connection
				connections.delete(res);
			}
		}
	}, 30000);
	return () => clearInterval(id);
};

export const emitEvent = (event, data) => {
	bus.emit(event, data);
	for (const res of connections) {
		try {
			res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
		} catch {
			connections.delete(res);
		}
	}
};
