"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.warehouseRoutes = void 0;
const express_1 = __importDefault(require("express"));
//
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const warehouse_controller_1 = require("./warehouse.controller");
const warehouse_validation_1 = require("./warehouse.validation");
const router = express_1.default.Router();
router.get('/', warehouse_controller_1.warehouseController.getAllFromDB);
router.post('/create', (0, validateRequest_1.default)(warehouse_validation_1.warehouseValidations.create), warehouse_controller_1.warehouseController.insertIntoDB);
router.patch('/:id', (0, validateRequest_1.default)(warehouse_validation_1.warehouseValidations.update), warehouse_controller_1.warehouseController.updateOneInDB);
router.delete('/:id', warehouse_controller_1.warehouseController.deleteByIdFromDB);
exports.warehouseRoutes = router;
