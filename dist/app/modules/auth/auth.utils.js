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
exports.isPasswordMatched = exports.isUserExist = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
function isUserExist(email) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield prisma_1.default.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                role: true,
                password: true,
                details: {
                    select: {
                        powers: {
                            select: {
                                id: true,
                            },
                        },
                    },
                },
            },
        });
        if (!result)
            return null;
        const { details } = result, userData = __rest(result, ["details"]);
        const powers = (details === null || details === void 0 ? void 0 : details.powers.map(power => power.id)) || [];
        return Object.assign(Object.assign({}, userData), { powers });
    });
}
exports.isUserExist = isUserExist;
function isPasswordMatched(givenPassword, savedPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(givenPassword, savedPassword);
    });
}
exports.isPasswordMatched = isPasswordMatched;
