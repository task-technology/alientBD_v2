import { z } from 'zod';

const create = z.object({
    body: z.object({
        name: z.string({
            required_error: 'name is required'
        }),
        email: z.string({
            required_error: 'email is required'
        }).email(),
        profileImage: z.string({
            required_error: 'Profile image is required'
        }),
        contactNo: z.string({
            required_error: 'Contact no is required'
        }),
        designation: z.string({
            required_error: 'designation is required'
        }),
        powerId: z.number({
            required_error: 'power is required'
        }),

    })
});

export const UserValidation = {
    create,
};