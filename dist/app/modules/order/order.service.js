"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const order_utilis_1 = require("./order.utilis");
const insertIntoDB = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const id = yield (0, order_utilis_1.generateOrderId)();
    try {
        const result = yield prisma_1.default.$transaction((transaction) => __awaiter(void 0, void 0, void 0, function* () {
            //check product  availability
            for (const { productId, quantity } of data.products) {
                const warehouseProduct = yield transaction.warehouseProduct.findUnique({
                    where: {
                        warehouseId_productId: {
                            warehouseId: data.warehouseId,
                            productId: productId,
                        },
                    },
                });
                if (!warehouseProduct || warehouseProduct.quantity < quantity) {
                    throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, `Insufficient quantity for product ${productId} in warehouse ${data.warehouseId}`);
                }
            }
            // Create the order
            const order = yield transaction.order.create({
                data: {
                    invoiceId: id,
                    warehouseId: data.warehouseId,
                    customerId: data.customerId,
                    inchargeId: data.inchargeId,
                    createdById: data.createdById,
                    products: {
                        create: data.products.map(product => ({
                            productId: product.productId,
                            quantity: product.quantity,
                        })),
                    },
                },
                include: {
                    products: true,
                },
            });
            for (const { productId, quantity } of data.products) {
                yield transaction.warehouseProduct.updateMany({
                    where: {
                        warehouseId: data.warehouseId,
                        productId: productId,
                    },
                    data: {
                        quantity: {
                            decrement: quantity,
                        },
                    },
                });
                yield transaction.product.update({
                    where: { id: productId },
                    data: {
                        availableQty: {
                            decrement: quantity,
                        },
                        sell: {
                            increment: quantity,
                        },
                    },
                });
            }
            return order;
        }));
        return result;
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, error.message);
    }
});
const getAllFromDB = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip } = paginationHelper_1.paginationHelpers.calculatePagination(options);
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: [
                { invoiceId: { contains: searchTerm, mode: 'insensitive' } },
                { customer: { name: { contains: searchTerm, mode: 'insensitive' } } },
                {
                    customer: {
                        contactNo: { contains: searchTerm, mode: 'insensitive' },
                    },
                },
            ],
        });
    }
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.entries(filterData).map(([field, value]) => ({
                [field]: value,
            })),
        });
    }
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma_1.default.order.findMany({
        where: whereConditions,
        include: {
            customer: {
                select: {
                    name: true,
                },
            },
            incharge: {
                select: {
                    name: true,
                },
            },
            createdBy: {
                select: {
                    name: true,
                },
            },
            products: {
                select: {
                    product: {
                        select: {
                            name: true,
                        },
                    },
                },
            },
        },
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? { [options.sortBy]: options.sortOrder }
            : {
                createdAt: 'desc',
            },
    });
    const total = yield prisma_1.default.order.count({
        where: whereConditions,
    });
    return {
        meta: {
            total,
            page,
            limit,
        },
        data: result.map(order => (Object.assign(Object.assign({}, order), { products: order.products.map(op => op.product.name) }))),
    };
});
const getByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.order.findUnique({
        where: {
            id,
        },
        include: {
            warehouse: {
                select: {
                    name: true,
                },
            },
            customer: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    contactNo: true,
                },
            },
            incharge: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    contactNo: true,
                },
            },
            createdBy: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    contactNo: true,
                },
            },
            products: {
                include: {
                    product: {
                        select: {
                            id: true,
                            name: true,
                            brand: true,
                        },
                    },
                },
            },
        },
    });
    return result;
});
exports.orderService = {
    insertIntoDB,
    getAllFromDB,
    getByIdFromDB,
};
