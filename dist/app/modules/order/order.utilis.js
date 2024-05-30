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
exports.generateOrderId = exports.findLastOrder = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const findLastOrder = () => __awaiter(void 0, void 0, void 0, function* () {
    const lastOrder = yield prisma_1.default.order.findFirst({
        orderBy: {
            createdAt: 'desc',
        },
        select: {
            invoiceId: true,
        },
    });
    return (lastOrder === null || lastOrder === void 0 ? void 0 : lastOrder.invoiceId) ? lastOrder === null || lastOrder === void 0 ? void 0 : lastOrder.invoiceId : undefined;
});
exports.findLastOrder = findLastOrder;
const generateOrderId = () => __awaiter(void 0, void 0, void 0, function* () {
    const currentId = (yield (0, exports.findLastOrder)()) || (0).toString().padStart(5, '0');
    const incrementedId = (parseInt(currentId) + 1).toString().padStart(5, '0');
    return incrementedId;
});
exports.generateOrderId = generateOrderId;
