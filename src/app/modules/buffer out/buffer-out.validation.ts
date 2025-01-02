import { z } from 'zod';

const create = z.object({
  body: z.object({
    warehouseId: z.number({
      required_error: 'warehouse is required',
    }),
    customerId: z.number({
      required_error: 'customer  Cost is required',
    }),
    inchargeId: z.number({
      required_error: 'incharge is required',
    }),
    createdById: z.number({
      required_error: 'createdBy  is required',
    }),
    products: z.array(
      z.object({
        productId: z.number({
          required_error: 'product is required',
        }),
        quantity: z.number({
          required_error: 'quantity is required',
        }),
      }),
    ),
  }),
});

export const orderValidation = {
  create,
};
