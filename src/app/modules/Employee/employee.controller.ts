import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { EmployeeFilterableFields } from "./employee.constant";
import { EmployeeService } from "./employee.service";

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, EmployeeFilterableFields);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await EmployeeService.getAllFromDB(filters, options);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Students fetched successfully',
        meta: result.meta,
        data: result.data
    });
});

const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const parseId = parseInt(id)
    const result = await EmployeeService.getByIdFromDB(parseId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'user fetched successfully',
        data: result
    });
});

// const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
//     const { id } = req.params;
//     const payload = req.body;
//     const result = await StudentService.updateIntoDB(id, payload);
//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: 'Student updated successfully',
//         data: result
//     });
// });

// const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
//     const { id } = req.params;
//     const result = await StudentService.deleteFromDB(id);
//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: 'Student deleted successfully',
//         data: result
//     });
// })


export const EmployeeController = {

    getAllFromDB,
    getByIdFromDB,
    // updateIntoDB,
    // deleteFromDB
};