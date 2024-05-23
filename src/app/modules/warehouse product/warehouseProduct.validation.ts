import { z } from 'zod';

const create = z.object({
  body: z.object({
    warehouseId: z.number({
      required_error: 'warehouseId is required',
    }),
    productId: z.number({
      required_error: 'productId is required',
    }),
    quantity: z.number({
      required_error: 'quantity Cost is required',
    }),
  }),
});

export const warehouseProductValidation = {
  create,
};
