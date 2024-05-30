"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductValidation = void 0;
const zod_1 = require("zod");
const create = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({
            required_error: 'name is required',
        }),
        brand: zod_1.z.string({
            required_error: 'brand is required',
        }),
        purchaseCost: zod_1.z.number({
            required_error: 'purchase Cost is required',
        }),
        unit: zod_1.z.string({
            required_error: 'unit is required',
        }),
        remainderQty: zod_1.z.number({
            required_error: 'remainder qty  is required',
        }),
    }),
});
exports.ProductValidation = {
    create,
};
