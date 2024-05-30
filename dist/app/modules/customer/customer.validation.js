"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerValidation = void 0;
const zod_1 = require("zod");
const create = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({
            required_error: 'name is required',
        }),
        email: zod_1.z.string({
            required_error: 'email is required',
        }),
        contactNo: zod_1.z.string({
            required_error: 'contact No. Cost is required',
        }),
        profileImage: zod_1.z.string().optional(),
    }),
});
const update = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        email: zod_1.z.string().optional(),
        contactNo: zod_1.z.string().optional(),
        profileImage: zod_1.z.string().optional(),
    }),
});
exports.customerValidation = {
    create,
    update,
};
