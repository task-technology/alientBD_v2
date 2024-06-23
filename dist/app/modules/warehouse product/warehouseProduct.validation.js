"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.warehouseProductValidation = void 0;
const zod_1 = require("zod");
const productSchema = zod_1.z.object({
    warehouseId: zod_1.z.string({
        required_error: 'warehouseId is required',
    }),
    productId: zod_1.z.string({
        required_error: 'productId is required',
    }),
    quantity: zod_1.z.string({
        required_error: 'quantity is required',
    }),
});
const create = zod_1.z.object({
    body: zod_1.z.array(productSchema),
});
const update = zod_1.z.object({
    body: zod_1.z.object({
        warehouseId: zod_1.z.number({
            required_error: 'warehouseId is required',
        }),
        productId: zod_1.z.number({
            required_error: 'productId is required',
        }),
        quantity: zod_1.z.number({
            required_error: 'quantity is required',
        })
    })
});
const productFileUploadSchema = zod_1.z.object({
    warehouseId: zod_1.z.number({
        required_error: 'warehouseId is required',
    }),
    name: zod_1.z.string({
        required_error: 'product name is required',
    }),
    brand: zod_1.z.string({
        required_error: 'product brand is required',
    }),
    quantity: zod_1.z.number({
        required_error: 'quantity is required',
    }),
});
const create_multiple = zod_1.z.object({
    body: zod_1.z.array(productFileUploadSchema),
});
const check = zod_1.z.object({
    body: zod_1.z.object({
        warehouseId: zod_1.z.string({
            required_error: 'warehouseId is required',
        }),
        productId: zod_1.z.string({
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
    update,
    create_multiple
};
