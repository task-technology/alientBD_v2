import { z } from 'zod';

const productSchema = z.object({
  warehouseId: z.string({
    required_error: 'warehouseId is required',
  }),
  productId: z.string({
    required_error: 'productId is required',
  }),
  quantity: z.string({
    required_error: 'quantity is required',
  }),
});

const create = z.object({
  body: z.array(productSchema),
});
const check = z.object({
  body: z.object({
    warehouseId: z.string({
      required_error: 'warehouseId is required',
    }),
    productId: z.string({
      required_error: 'productId is required',
    }),
    quantity: z.number({
      required_error: 'quantity is required',
    }),
  }),
});

export const warehouseProductValidation = {
  create,
  check,
};
