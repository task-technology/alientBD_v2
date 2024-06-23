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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const pagination_1 = require("../../../constants/pagination");
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const pick_1 = __importDefault(require("../../../shared/pick"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const product_constant_1 = require("./product.constant");
const product_service_1 = require("./product.service");
const insertIntoDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_service_1.ProductService.insertIntoDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'product created successfully',
        data: result,
    });
}));
const FileInsertIntoDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_service_1.ProductService.insertManyIntoDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'product created successfully',
        data: result,
    });
}));
const getAllFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, product_constant_1.productFilterableFields);
    const options = (0, pick_1.default)(req.query, pagination_1.paginationFields);
    const result = yield product_service_1.ProductService.getAllFromDB(filters, options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'products fetched successfully',
        meta: result.meta,
        data: result.data,
    });
}));
const getEmptyFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, product_constant_1.productFilterableFields);
    const options = (0, pick_1.default)(req.query, pagination_1.paginationFields);
    const result = yield product_service_1.ProductService.getEmptyFromDB(filters, options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Empty products fetched successfully',
        meta: result.meta,
        data: result.data,
    });
}));
const getRemainderFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, product_constant_1.productFilterableFields);
    const options = (0, pick_1.default)(req.query, pagination_1.paginationFields);
    const result = yield product_service_1.ProductService.getRemainderFromDB(filters, options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'low quantity products fetched successfully',
        meta: result.meta,
        data: result.data,
    });
}));
const getRemainderCountFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_service_1.ProductService.getRemainderCountFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'low quantity products count successfully',
        data: result,
    });
}));
const getAvailableFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, product_constant_1.productFilterableFields);
    const options = (0, pick_1.default)(req.query, pagination_1.paginationFields);
    const result = yield product_service_1.ProductService.getAvailableQtyFromDB(filters, options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'products fetched successfully',
        meta: result.meta,
        data: result.data,
    });
}));
const getInventoryReportFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, product_constant_1.productFilterableFields);
    const options = (0, pick_1.default)(req.query, pagination_1.paginationFields);
    const result = yield product_service_1.ProductService.getInventoryReportFromDB(filters, options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'inventory report fetched successfully',
        meta: result.meta,
        data: result.data,
    });
}));
const getByIdFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const parseId = parseInt(id);
    const result = yield product_service_1.ProductService.getByIdFromDB(parseId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'product fetched successfully',
        data: result,
    });
}));
const updateOneInDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield product_service_1.ProductService.updateOneInDB(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'product updated successfully',
        data: result,
    });
}));
const deleteByIdFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield product_service_1.ProductService.deleteByIdFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'product delete successfully',
        data: result,
    });
}));
exports.ProductController = {
    insertIntoDB,
    FileInsertIntoDB,
    getAllFromDB,
    getByIdFromDB,
    updateOneInDB,
    deleteByIdFromDB,
    getAvailableFromDB,
    getInventoryReportFromDB,
    getRemainderFromDB,
    getRemainderCountFromDB,
    getEmptyFromDB,
};
