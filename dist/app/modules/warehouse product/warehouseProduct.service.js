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
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const insertIntoDB = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const warehouseId = data.warehouseId;
    const products = data.product;
    const warehouseProducts = yield Promise.all(products.map((product) => __awaiter(void 0, void 0, void 0, function* () {
        let warehouseProduct = yield prisma_1.default.warehouseProduct.findFirst({
            where: {
                warehouseId: warehouseId,
                productId: product.productId,
            },
        });
        if (warehouseProduct) {
            warehouseProduct = yield prisma_1.default.warehouseProduct.update({
                where: { id: warehouseProduct.id },
                data: { quantity: warehouseProduct.quantity + product.quantity },
            });
        }
        else {
            warehouseProduct = yield prisma_1.default.warehouseProduct.create({
                data: {
                    warehouseId: warehouseId,
                    productId: product.productId,
                    quantity: product.quantity,
                },
            });
        }
        yield prisma_1.default.product.update({
            where: { id: product.productId },
            data: {
                availableQty: {
                    increment: product.quantity,
                },
                totalPurchased: {
                    increment: product.quantity,
                },
            },
        });
        return warehouseProduct;
    })));
    return warehouseProducts;
});
const getAllFromDB = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip } = paginationHelper_1.paginationHelpers.calculatePagination(options);
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: [
                { product: { name: { contains: searchTerm } } },
                { product: { brand: { contains: searchTerm } } },
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
});
exports.warehouseProductService = {
    insertIntoDB,
    getAllFromDB,
    getByIdFromDB,
    getBywarehouseProductCountFromDB,
};
