"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const order_controlller_1 = require("./order.controlller");
const order_validation_1 = require("./order.validation");
const router = express_1.default.Router();
router.post('/create', (0, validateRequest_1.default)(order_validation_1.orderValidation.create), order_controlller_1.orderController.insertIntoDB);
router.get('/', order_controlller_1.orderController.getAllFromDB);
router.get('/:id', order_controlller_1.orderController.getByIdFromDB);
exports.orderRoutes = router;
