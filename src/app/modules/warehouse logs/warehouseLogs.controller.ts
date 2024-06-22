import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { warehouseFilterableFields } from './warehouseLogs.constants';
import { WarehouseLogsService } from './warehouseLogs.service';


const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, warehouseFilterableFields);
  const options = pick(req.query, paginationFields);
  const result = await WarehouseLogsService.getAllFromDB(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'warehouse fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});

const updateOneInDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await WarehouseLogsService.updateOneInDB(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'warehouse updated successfully',
    data: result,
  });
});

const deleteByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await WarehouseLogsService.deleteByIdFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'warehouse delete successfully',
    data: result,
  });
});

export const warehouseLogsController = {
  getAllFromDB,
  updateOneInDB,
  deleteByIdFromDB,
};
