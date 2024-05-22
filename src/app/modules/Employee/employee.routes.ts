import express from 'express';
import { EmployeeController } from './employee.controller';


const router = express.Router();

router.get(
  '/',
  EmployeeController.getAllFromDB
);
router.get(
  '/:id',
  EmployeeController.getByIdFromDB
);



export const employeeRoutes = router;