"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeValidation = void 0;
const zod_1 = require("zod");
const update = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        email: zod_1.z.string().optional(),
        profileImage: zod_1.z.string().optional(),
        contactNo: zod_1.z.string().optional(),
        designation: zod_1.z.string().optional(),
        powerId: zod_1.z.array(zod_1.z.number().optional()),
    }),
});
exports.EmployeeValidation = {
    update,
};
