"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.warehouseProductRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const warehouseProduct_controlller_1 = require("./warehouseProduct.controlller");
const warehouseProduct_validation_1 = require("./warehouseProduct.validation");
const router = express_1.default.Router();
router.post('/create', (0, validateRequest_1.default)(warehouseProduct_validation_1.warehouseProductValidation.create), warehouseProduct_controlller_1.warehouseProductController.insertIntoDB);
router.get('/', warehouseProduct_controlller_1.warehouseProductController.getAllFromDB);
router.get('/data', warehouseProduct_controlller_1.warehouseProductController.getwarehouseProductcountromDB);
router.get('/:id', warehouseProduct_controlller_1.warehouseProductController.getByIdFromDB);
exports.warehouseProductRoutes = router;
