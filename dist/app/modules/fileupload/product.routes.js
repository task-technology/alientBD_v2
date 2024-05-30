"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const product_controlller_1 = require("./product.controlller");
const product_validation_1 = require("./product.validation");
const router = express_1.default.Router();
router.post('/create', (0, validateRequest_1.default)(product_validation_1.ProductValidation.create), product_controlller_1.ProductController.insertIntoDB);
router.get('/', product_controlller_1.ProductController.getAllFromDB);
router.get('/:id', product_controlller_1.ProductController.getByIdFromDB);
exports.productRoutes = router;
