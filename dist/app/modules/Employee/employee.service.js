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
exports.EmployeeService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const employee_constant_1 = require("./employee.constant");
const getAllFromDB = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip } = paginationHelper_1.paginationHelpers.calculatePagination(options);
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: employee_constant_1.EmployeeSearchableFields.map(field => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            })),
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
    const result = yield prisma_1.default.userDetails.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? { [options.sortBy]: options.sortOrder }
            : { user: { createdAt: 'desc' } },
    });
    const total = yield prisma_1.default.userDetails.count({
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
const getAllPowerFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.power.findMany();
    const total = yield prisma_1.default.power.count();
    return {
        meta: {
            total,
            limit: 1,
            page: 1
        },
        data: result,
    };
});
const getByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.userDetails.findUnique({
        where: {
            id
        },
        include: {
            powers: {
                select: {
                    id: true
                }
            }
        }
    });
    return result;
});
const updateIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { powerId } = payload, userDetailsData = __rest(payload, ["powerId"]);
    const result = yield prisma_1.default.userDetails.update({
        where: {
            id: parseInt(id),
        },
        data: Object.assign(Object.assign({}, userDetailsData), { powers: {
                set: powerId.map(id => ({ id })),
            }, user: userDetailsData.email
                ? {
                    update: {
                        email: userDetailsData.email,
                    },
                }
                : undefined }),
        include: {
            powers: true,
            user: true,
        },
    });
    return result;
});
const deleteFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.userDetails.findUnique({
        where: {
            id: parseInt(id),
        },
        include: {
            user: true,
        },
    });
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'user not found');
    }
    const result = yield prisma_1.default.userDetails.delete({
        where: {
            id: parseInt(id),
        },
    });
    yield prisma_1.default.user.delete({
        where: {
            id: result.userId,
        },
    });
    return result;
});
exports.EmployeeService = {
    getAllFromDB,
    getByIdFromDB,
    deleteFromDB,
    updateIntoDB,
    getAllPowerFromDB
};
