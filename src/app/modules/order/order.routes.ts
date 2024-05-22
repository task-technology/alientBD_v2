import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { orderController } from './order.controlller';
import { orderValidation } from './order.validation';

const router = express.Router();

router.post(
  '/create',
  validateRequest(orderValidation.create),
  orderController.insertIntoDB
);

router.get('/',
  orderController.getAllFromDB
);

router.get('/:id',
  orderController.getByIdFromDB
);

export const orderRoutes = router;