'use client';

import React, { useEffect, useState } from 'react';

const Cart = () => {
	const [cart, setCart] = useState(null);

	useEffect(() => {
		let canceled = false;

		const run = async () => {
			try {
				const res = await fetch('/api/cart', {
					headers: { Accept: 'application/json' },
				});
				if (!res.ok) return;

				const data = await res.json();
				if (!canceled) setCart(data);
			} catch {
				// ignore
			}
		};

		run();

		return () => {
			canceled = true;
		};
	}, []);

	if (!cart) {
		return (
			<div>
				<div>
					<strong>Mini Cart</strong>
				</div>
				<div>Loading cart…</div>
			</div>
		);
	}

	return (
		<div>
			<div>
				<strong>Mini Cart</strong>
			</div>
			<div>Items: {cart.itemCount}</div>
			<div>Total: ${Number(cart.total).toFixed(2)}</div>
		</div>
	);
};

export default Cart;
