"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRelationalFieldsMapper = exports.productRelationalFields = exports.productSearchableFields = exports.productFilterableFields = void 0;
exports.productFilterableFields = [
    'searchTerm',
    'warehouseId',
    'productId',
    'quantity',
];
exports.productSearchableFields = [
    'product.name',
    'product.brand',
];
exports.productRelationalFields = ['productId', 'warehouseId'];
exports.productRelationalFieldsMapper = {
    productId: 'product',
    warehouseId: 'warehouse',
};
