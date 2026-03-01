import { cartModel } from '../models/index.js';

export const getCart = (req, res) => {
	res.json(cartModel.getCart());
};

export const addItem = (req, res) => {
	const item = req.body;
	res.json(cartModel.addItem(item));
};
