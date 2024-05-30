"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const customer_controlller_1 = require("./customer.controlller");
const customer_validation_1 = require("./customer.validation");
const router = express_1.default.Router();
router.post('/create', (0, validateRequest_1.default)(customer_validation_1.customerValidation.create), customer_controlller_1.CustomerController.insertIntoDB);
router.get('/', customer_controlller_1.CustomerController.getAllFromDB);
router.get('/:id', customer_controlller_1.CustomerController.getByIdFromDB);
exports.customerRoutes = router;
