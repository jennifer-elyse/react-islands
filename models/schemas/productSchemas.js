// models/schemas/productSchemas.js

import { z } from '../validate.js';

const localizedStringSchema = z.record(z.string(), z.string()).default({});

const moneySchema = z.object({
	centAmount: z.number(),
	currencyCode: z.string(),
});

const priceSchema = z.object({
	value: moneySchema,
});

const imageSchema = z
	.object({
		url: z.string(),
		dimensions: z
			.object({
				w: z.number(),
				h: z.number(),
			})
			.optional(),
	})
	.optional();

const variantSchema = z.object({
	id: z.number().optional(),
	sku: z.string().optional(),
	prices: z.array(priceSchema).optional(),
	images: z.array(imageSchema).optional(),
	attributes: z
		.array(
			z.object({
				name: z.string(),
				value: z.any(),
			}),
		)
		.optional(),
});

const productCurrentSchema = z.object({
	name: localizedStringSchema,
	slug: localizedStringSchema.optional(),
	description: localizedStringSchema.optional(),
	masterVariant: variantSchema,
	variants: z.array(variantSchema).optional(),
});

const productSchema = z.object({
	id: z.string(),
	masterData: z.object({
		current: productCurrentSchema,
	}),
});

const productPagedQueryResponseSchema = z.object({
	results: z.array(productSchema).default([]),
	total: z.number().optional(),
	offset: z.number().optional(),
	count: z.number().optional(),
});

// Product Projection schemas (for published products)
const productProjectionSchema = z.object({
	id: z.string(),
	name: localizedStringSchema,
	slug: localizedStringSchema.optional(),
	description: localizedStringSchema.optional(),
	masterVariant: variantSchema,
	variants: z.array(variantSchema).optional(),
	categories: z
		.array(
			z.object({
				id: z.string(),
				typeId: z.string(),
			}),
		)
		.optional(),
});

const productProjectionPagedQueryResponseSchema = z.object({
	results: z.array(productProjectionSchema).default([]),
	total: z.number().optional(),
	offset: z.number().optional(),
	count: z.number().optional(),
});

// Product Search response (ID-first)
const productSearchResultSchema = z.object({
	id: z.string(),
	productProjection: productProjectionSchema.optional(),
});

const productSearchResponseSchema = z.object({
	results: z.array(productSearchResultSchema).default([]),
	total: z.number().optional(),
	offset: z.number().optional(),
	facets: z.any().optional(),
});

export {
	productSchema,
	productPagedQueryResponseSchema,
	productProjectionSchema,
	productProjectionPagedQueryResponseSchema,
	productSearchResultSchema,
	productSearchResponseSchema,
	localizedStringSchema,
	moneySchema,
};
