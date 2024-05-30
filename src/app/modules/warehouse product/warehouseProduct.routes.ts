import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { warehouseProductController } from './warehouseProduct.controlller';
import { warehouseProductValidation } from './warehouseProduct.validation';

const router = express.Router();

router.post(
  '/create',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(warehouseProductValidation.create),
  warehouseProductController.insertIntoDB,
);
router.get(
  '/',
  auth(
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.EMPLOYEE,
  ),
  warehouseProductController.getAllFromDB,
);
router.get(
  '/data',
  auth(
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.EMPLOYEE,
  ),
  warehouseProductController.getwarehouseProductcountromDB,
);
router.get(
  '/check',
  auth(
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.EMPLOYEE,
  ),
  validateRequest(warehouseProductValidation.check),
  warehouseProductController.getwarehouseProductcountromDB,
);

router.get(
  '/:id',
  auth(
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.EMPLOYEE,
  ),
  warehouseProductController.getByIdFromDB,
);

export const warehouseProductRoutes = router;
