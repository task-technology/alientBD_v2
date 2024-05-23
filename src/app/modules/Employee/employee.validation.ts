import { z } from 'zod';

const update = z.object({
  body: z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    profileImage: z.string().optional(),
    contactNo: z.string().optional(),
    designation: z.string().optional(),
    powerId: z.array(z.number().optional()),
  }),
});

export const EmployeeValidation = {
  update,
};
