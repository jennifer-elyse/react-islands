// models/schemas/cartSchemas.js

import { z } from '../validate.js';

const localizedStringSchema = z.record(z.string(), z.string()).default({});

const moneySchema = z.object({
	centAmount: z.number(),
	currencyCode: z.string(),
});

const lineItemSchema = z.object({
	id: z.string(),
	productId: z.string(),
	name: localizedStringSchema,
	quantity: z.number(),
	variant: z
		.object({
			id: z.number().optional(),
			sku: z.string().optional(),
			images: z
				.array(
					z.object({
						url: z.string(),
					}),
				)
				.optional(),
		})
		.optional(),
	price: z
		.object({
			value: moneySchema,
		})
		.optional(),
	totalPrice: moneySchema,
});

const cartSchema = z.object({
	id: z.string(),
	version: z.number(),
	customerId: z.string().optional(),
	anonymousId: z.string().optional(),
	lineItems: z.array(lineItemSchema).default([]),
	totalPrice: moneySchema,
	cartState: z.string().optional(),
	country: z.string().optional(),
	shippingAddress: z.any().optional(),
	billingAddress: z.any().optional(),
});

export { cartSchema, lineItemSchema, localizedStringSchema, moneySchema };
