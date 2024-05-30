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
exports.userService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../../../config"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const insertIntoDB = (data, role) => __awaiter(void 0, void 0, void 0, function* () {
    const hashedPassword = yield bcrypt_1.default.hash(config_1.default.default_pass || "123456", Number(config_1.default.bcrypt_salt_rounds));
    const result = yield prisma_1.default.user.create({
        data: {
            email: data.email,
            role: role,
            password: hashedPassword,
            details: {
                create: {
                    email: data.email,
                    name: data.name,
                    contactNo: data.contactNo,
                    designation: data.designation,
                    profileImage: data.profileImage,
                    role: role,
                    powers: {
                        connect: data.powerId.map(id => ({ id })),
                    },
                },
            },
        },
        include: {
            details: true,
        },
    });
    return result;
});
const createPower = (name) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.power.create({
        data: {
            name: name,
        },
    });
    return result;
});
exports.userService = {
    insertIntoDB,
    createPower,
};
