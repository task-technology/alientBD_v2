"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.warehouseLogsRoutes = void 0;
const express_1 = __importDefault(require("express"));
//
const user_1 = require("../../../enums/user");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const warehouseLogs_controller_1 = require("./warehouseLogs.controller");
const warehouseLogs_validation_1 = require("./warehouseLogs.validation");
const router = express_1.default.Router();
router.get('/', 
// auth(
//   ENUM_USER_ROLE.SUPER_ADMIN,
//   ENUM_USER_ROLE.ADMIN,
//   ENUM_USER_ROLE.EMPLOYEE,
// ),
warehouseLogs_controller_1.warehouseLogsController.getAllFromDB);
router.patch('/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.EMPLOYEE), (0, validateRequest_1.default)(warehouseLogs_validation_1.warehouseValidations.update), warehouseLogs_controller_1.warehouseLogsController.updateOneInDB);
// router.delete(
//   '/:id',
//   auth(
//     ENUM_USER_ROLE.SUPER_ADMIN,
//     ENUM_USER_ROLE.ADMIN,
//   ),
//   warehouseLogsController.deleteByIdFromDB,
// );
exports.warehouseLogsRoutes = router;
