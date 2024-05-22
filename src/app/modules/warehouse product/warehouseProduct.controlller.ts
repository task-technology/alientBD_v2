import { Request, Response } from "express";
import httpStatus from "http-status";
import { paginationFields } from "../../../constants/pagination";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { productFilterableFields } from "./warehouseProduct.constant";
import { warehouseProductService } from "./warehouseProduct.service";



const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
    const result = await warehouseProductService.insertIntoDB(req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'product quantity updated successfully',
        data: result
    });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, productFilterableFields);
    const options = pick(req.query, paginationFields);
    const result = await warehouseProductService.getAllFromDB(filters, options);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'product data fetched successfully',
        meta: result.meta,
        data: result.data
    });
});

const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const parseId = parseInt(id)
    const result = await warehouseProductService.getByIdFromDB(parseId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'product quantity fetched successfully',
        data: result
    });
});


export const warehouseProductController = {
    insertIntoDB,
    getAllFromDB,
    getByIdFromDB,
    // updateIntoDB,
    // deleteFromDB
};
