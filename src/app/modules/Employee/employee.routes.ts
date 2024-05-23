import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { EmployeeController } from './employee.controller';


const router = express.Router();

router.get(
  '/',
   auth( ENUM_USER_ROLE.ADMIN,ENUM_USER_ROLE.SUPER_ADMIN,ENUM_USER_ROLE.EMPLOYEE),
  EmployeeController.getAllFromDB
);
router.get(
  '/:id',
  auth( ENUM_USER_ROLE.ADMIN,ENUM_USER_ROLE.SUPER_ADMIN,ENUM_USER_ROLE.EMPLOYEE),
  EmployeeController.getByIdFromDB
);



export const employeeRoutes = router;