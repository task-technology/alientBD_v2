import { Prisma, UserDetails } from "@prisma/client";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import prisma from "../../../shared/prisma";
import { EmployeeSearchableFields } from "./employee.constant";
import { IEmployeeFilterRequest } from "./employee.interface";


const getAllFromDB = async (
    filters: IEmployeeFilterRequest,
    options: IPaginationOptions
): Promise<IGenericResponse<UserDetails[]>> => {
    const { limit, page, skip } = paginationHelpers.calculatePagination(options);
    const { searchTerm, ...filterData } = filters;

    const andConditions = [];

    if (searchTerm) {
        andConditions.push({
            OR: EmployeeSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive'
                }
            }))
        });
    }

    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.entries(filterData).map(([field, value]) => ({
                [field]: value,
            })),
        });
    }

    const whereConditions: Prisma.UserDetailsWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.userDetails.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? { [options.sortBy]: options.sortOrder }
            : { user: { createdAt: 'desc' } },
    });


    const total = await prisma.userDetails.count({
        where: whereConditions
    });

    return {
        meta: {
            total,
            page,
            limit
        },
        data: result
    };
};
// power: true
const getByIdFromDB = async (id: number): Promise<UserDetails | null> => {
    const result = await prisma.userDetails.findUnique({
        where: {
            id
        },
        include:{
            user:true
            
        }
    });
    return result;
};











export const EmployeeService = {
    getAllFromDB,
    getByIdFromDB
};