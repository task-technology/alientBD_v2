"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.warehouseProductValidation = void 0;
const zod_1 = require("zod");
const productSchema = zod_1.z.object({
    warehouseId: zod_1.z.number({
        required_error: 'warehouseId is required',
    }),
    productId: zod_1.z.number({
        required_error: 'productId is required',
    }),
    quantity: zod_1.z.number({
        required_error: 'quantity is required',
    }),
});
const create = zod_1.z.object({
    body: zod_1.z.array(productSchema),
});
const check = zod_1.z.object({
    body: zod_1.z.object({
        warehouseId: zod_1.z.number({
            required_error: 'warehouseId is required',
        }),
        productId: zod_1.z.number({
            required_error: 'productId is required',
        }),
        quantity: zod_1.z.number({
            required_error: 'quantity is required',
        }),
    }),
});
exports.warehouseProductValidation = {
    create,
    check,
};
