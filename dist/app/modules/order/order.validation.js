"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderValidation = void 0;
const zod_1 = require("zod");
const create = zod_1.z.object({
    body: zod_1.z.object({
        warehouseId: zod_1.z.number({
            required_error: 'warehouse is required',
        }),
        customerId: zod_1.z.number({
            required_error: 'customer  Cost is required',
        }),
        inchargeId: zod_1.z.number({
            required_error: 'incharge is required',
        }),
        createdById: zod_1.z.number({
            required_error: 'createdBy  is required',
        }),
        products: zod_1.z.array(zod_1.z.object({
            productId: zod_1.z.number({
                required_error: 'product is required',
            }),
            quantity: zod_1.z.number({
                required_error: 'quantity is required',
            }),
        })),
    }),
});
exports.orderValidation = {
    create,
};
