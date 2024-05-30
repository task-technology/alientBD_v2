"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
const create = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({
            required_error: 'name is required',
        }),
        email: zod_1.z
            .string({
            required_error: 'email is required',
        })
            .email(),
        profileImage: zod_1.z.string({
            required_error: 'Profile image is required',
        }),
        contactNo: zod_1.z.string({
            required_error: 'Contact no is required',
        }),
        designation: zod_1.z.string({
            required_error: 'designation is required',
        }),
        powerId: zod_1.z.array(zod_1.z.number({
            required_error: 'power is required',
        })),
    }),
});
const createpower = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({
            required_error: 'name is required',
        }),
    }),
});
exports.UserValidation = {
    create,
    createpower,
};
