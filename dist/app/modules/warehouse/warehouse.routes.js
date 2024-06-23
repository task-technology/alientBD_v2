"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.warehouseRoutes = void 0;
const express_1 = __importDefault(require("express"));
//
const user_1 = require("../../../enums/user");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const warehouse_controller_1 = require("./warehouse.controller");
const warehouse_validation_1 = require("./warehouse.validation");
const router = express_1.default.Router();
router.get('/', (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.EMPLOYEE), warehouse_controller_1.warehouseController.getAllFromDB);
router.post('/create', (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.EMPLOYEE), (0, validateRequest_1.default)(warehouse_validation_1.warehouseValidations.create), warehouse_controller_1.warehouseController.insertIntoDB);
router.patch('/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.EMPLOYEE), (0, validateRequest_1.default)(warehouse_validation_1.warehouseValidations.update), warehouse_controller_1.warehouseController.updateOneInDB);
exports.warehouseRoutes = router;
