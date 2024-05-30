import { z } from 'zod';

const productSchema = z.object({
  warehouseId: z.number({
    required_error: 'warehouseId is required',
  }),
  productId: z.number({
    required_error: 'productId is required',
  }),
  quality: z.number({
    required_error: 'quality is required',
  }),
});

const create = z.object({
  body: z.array(productSchema),
});
const check = z.object({
  body: z.object({
    warehouseId: z.number({
      required_error: 'warehouseId is required',
    }),
    productId: z.number({
      required_error: 'productId is required',
    }),
    quality: z.number({
      required_error: 'quality is required',
    }),
  }),
});

export const warehouseProductValidation = {
  create,
  check,
};
