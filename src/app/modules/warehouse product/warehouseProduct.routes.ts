import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { warehouseProductController } from './warehouseProduct.controlller';
import { warehouseProductValidation } from './warehouseProduct.validation';

const router = express.Router();

router.post(
  '/create',
  validateRequest(warehouseProductValidation.create),
  warehouseProductController.insertIntoDB,
);

router.get('/', warehouseProductController.getAllFromDB);
router.get('/data', warehouseProductController.getwarehouseProductcountromDB);

router.get('/:id', warehouseProductController.getByIdFromDB);

export const warehouseProductRoutes = router;
