import express from 'express';
//
import validateRequest from "../../middlewares/validateRequest";
import { warehouseController } from './warehouse.controller';
import { warehouseValidations } from "./warehouse.validation";

const router = express.Router();

router.get('/', warehouseController.getAllFromDB);

router.post(
    '/create',
    validateRequest(warehouseValidations.create),
    warehouseController.insertIntoDB);


router.patch(
    '/:id',
    validateRequest(warehouseValidations.update),
    warehouseController.updateOneInDB
);

router.delete(
    '/:id',
    warehouseController.deleteByIdFromDB
);

export const warehouseRoutes = router;