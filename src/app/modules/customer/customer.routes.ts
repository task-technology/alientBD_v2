import express from 'express';
import validateRequest from '../../middlewares/validateRequest';

import { CustomerController } from './customer.controlller';
import { customerValidation } from './customer.validation';

const router = express.Router();

router.post(
  '/create',
  validateRequest(customerValidation.create),
  CustomerController.insertIntoDB
);

router.get('/',
  CustomerController.getAllFromDB
);

router.get('/:id',
  CustomerController.getByIdFromDB
);

export const customerRoutes = router;