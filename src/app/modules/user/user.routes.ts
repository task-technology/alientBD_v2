import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';

const router = express.Router();

router.post(
  '/create-employee',
  validateRequest(UserValidation.create),
  UserController.createEmployee,
);
router.post(
  '/create-power',
  validateRequest(UserValidation.createpower),
  UserController.createPower,
);

router.post(
  '/create-admin',
  UserController.createAdmin
);

export const UserRoutes = router;
