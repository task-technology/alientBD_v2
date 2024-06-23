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
exports.warehouseProductService = void 0;
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const insertIntoDB = (data, user) => __awaiter(void 0, void 0, void 0, function* () {
    const warehouseProducts = yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        const results = [];
        for (const item of data) {
            let warehouseProduct = yield prisma.warehouseProduct.findFirst({
                where: {
                    warehouseId: parseInt(item.warehouseId),
                    productId: parseInt(item.productId),
                },
            });
            if (warehouseProduct) {
                warehouseProduct = yield prisma.warehouseProduct.update({
                    where: { id: warehouseProduct.id },
                    data: {
                        quantity: warehouseProduct.quantity + parseInt(item.quantity),
                    },
                });
            }
            else {
                warehouseProduct = yield prisma.warehouseProduct.create({
                    data: {
                        warehouseId: parseInt(item.warehouseId),
                        productId: parseInt(item.productId),
                        quantity: parseInt(item.quantity),
                    },
                });
            }
            yield prisma.product.update({
                where: { id: parseInt(item.productId) },
                data: {
                    availableQty: {
                        increment: parseInt(item.quantity),
                    },
                    totalPurchased: {
                        increment: parseInt(item.quantity),
                    },
                },
            });
            yield prisma.warehouseProductLog.create({
                data: {
                    warehouseId: parseInt(item.warehouseId),
                    productId: parseInt(item.productId),
                    quantity: parseInt(item.quantity),
                    userId: user.id,
                },
            });
            results.push(warehouseProduct);
        }
        return results;
    }));
    return warehouseProducts;
});
const MultiInsertIntoDB = (data, user) => __awaiter(void 0, void 0, void 0, function* () {
    const results = [];
    for (const item of data) {
        // Fetch the productId using name and brand
        const product = yield prisma_1.default.product.findFirst({
            where: {
                name: item.name,
                brand: item.brand,
            },
        });
        if (!product) {
            throw new Error(`Product with name ${item.name} and brand ${item.brand} not found`);
        }
        const productId = product.id;
        // Check if the warehouse product exists
        let warehouseProduct = yield prisma_1.default.warehouseProduct.findFirst({
            where: {
                warehouseId: parseInt(item.warehouseId),
                productId: productId,
            },
        });
        if (warehouseProduct) {
            // Update the existing warehouse product
            warehouseProduct = yield prisma_1.default.warehouseProduct.update({
                where: { id: warehouseProduct.id },
                data: {
                    quantity: warehouseProduct.quantity + parseInt(item.quantity),
                },
            });
        }
        else {
            // Create a new warehouse product
            warehouseProduct = yield prisma_1.default.warehouseProduct.create({
                data: {
                    warehouseId: parseInt(item.warehouseId),
                    productId: productId,
                    quantity: parseInt(item.quantity),
                },
            });
        }
        // Update the product quantities
        yield prisma_1.default.product.update({
            where: { id: productId },
            data: {
                availableQty: {
                    increment: parseInt(item.quantity),
                },
                totalPurchased: {
                    increment: parseInt(item.quantity),
                },
            },
        });
        yield prisma_1.default.warehouseProductLog.create({
            data: {
                warehouseId: parseInt(item.warehouseId),
                productId,
                quantity: parseInt(item.quantity),
                userId: user.id,
            },
        });
        results.push(warehouseProduct);
    }
    return results;
});
const getAllFromDB = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip } = paginationHelper_1.paginationHelpers.calculatePagination(options);
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
    const andConditions = [];
    andConditions.push({
        quantity: {
            gt: 0,
        },
    });
    if (searchTerm) {
        andConditions.push({
            OR: [
                { product: { name: { contains: searchTerm, mode: 'insensitive' } } },
                { product: { brand: { contains: searchTerm, mode: 'insensitive' } } },
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
    const result = yield prisma_1.default.warehouseProduct.findMany({
        where: whereConditions,
        include: {
            product: {
                select: {
                    name: true,
                    brand: true,
                },
            },
            warehouse: {
                select: {
                    name: true,
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
    const total = yield prisma_1.default.warehouseProduct.count({
        where: whereConditions,
    });
    return {
        meta: {
            total,
            page,
            limit,
        },
        data: result,
    };
});
const getByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.warehouseProduct.findUnique({
        where: {
            id,
        },
        include: {
            product: {
                select: {
                    name: true,
                    brand: true,
                },
            },
            warehouse: {
                select: {
                    name: true,
                },
            },
        },
    });
    return result;
});
const CheckQtyFromDB = (warehouseId, productId, quantity) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.warehouseProduct.findFirst({
        where: {
            warehouseId: parseInt(warehouseId),
            productId: parseInt(productId),
            quantity: {
                gte: quantity,
            },
        },
    });
    return result;
});
const getBywarehouseProductCountFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const warehouses = yield prisma_1.default.warehouse.findMany({
        include: {
            products: {
                select: {
                    quantity: true,
                },
            },
        },
    });
    const summary = warehouses.map(warehouse => {
        const productCount = warehouse.products.length;
        const totalQuantity = warehouse.products.reduce((sum, product) => sum + product.quantity, 0);
        return {
            warehouseId: warehouse.id,
            warehouseName: warehouse.name,
            productCount,
            totalQuantity,
        };
    });
    return summary;
});
const updateIntoDB = (payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    const warehouseProduct = yield prisma_1.default.warehouseProduct.findUnique({
        where: {
            warehouseId_productId: {
                warehouseId: payload.warehouseId,
                productId: payload.productId,
            },
        },
    });
    if (!warehouseProduct) {
        throw new ApiError_1.default(400, 'not found product');
    }
    const updatedWarehouseProduct = yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        const updatedWarehouseProduct = yield prisma.warehouseProduct.update({
            where: { id: warehouseProduct.id },
            data: { quantity: payload.quantity },
        });
        yield prisma.product.update({
            where: { id: payload.productId },
            data: {
                availableQty: {
                    decrement: warehouseProduct.quantity,
                },
                totalPurchased: {
                    decrement: warehouseProduct.quantity,
                },
            },
        });
        // Step 2: Add the new quantity
        yield prisma.product.update({
            where: { id: payload.productId },
            data: {
                availableQty: {
                    increment: payload.quantity,
                },
                totalPurchased: {
                    increment: payload.quantity,
                },
            },
        });
        // Log the quantity update
        yield prisma.warehouseProductLog.create({
            data: {
                warehouseId: payload.warehouseId,
                productId: payload.productId,
                quantity: -payload.quantity,
                userId: user.id,
            },
        });
        return updatedWarehouseProduct;
    }));
    return updatedWarehouseProduct;
});
exports.warehouseProductService = {
    insertIntoDB,
    getAllFromDB,
    getByIdFromDB,
    getBywarehouseProductCountFromDB,
    CheckQtyFromDB,
    MultiInsertIntoDB,
    updateIntoDB,
};
