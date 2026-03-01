import * as cartModel from '../../contentstack-demo/models/cart.model.js';

export const getCart = (_req, res) => {
	res.json(cartModel.getCart());
};

export const addItem = (req, res) => {
	const item = req.body;
	res.json(cartModel.addItem(item));
};
