import { Order, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { IEmployeeFilterRequest } from '../Employee/employee.interface';
import { IOrderCreatedEvent } from './order.interface';
import { generateOrderId } from './order.utilis';

const insertIntoDB = async (data: IOrderCreatedEvent): Promise<Order> => {
  const id = await generateOrderId();
  try {
    const result = await prisma.$transaction(async transaction => {
      //check product  availability
      for (const { productId, quantity } of data.products) {
        const warehouseProduct = await transaction.warehouseProduct.findUnique({
          where: {
            warehouseId_productId: {
              warehouseId: data.warehouseId,
              productId: productId,
            },
          },
        });

        if (!warehouseProduct || warehouseProduct.quantity < quantity) {
          throw new ApiError(
            httpStatus.BAD_REQUEST,
            `Insufficient quantity for product ${productId} in warehouse ${data.warehouseId}`,
          );
        }
      }
      // Create the order
      const order = await transaction.order.create({
        data: {
          invoiceId: id,
          warehouseId: data.warehouseId,
          customerId: data.customerId,
          inchargeId: data.inchargeId,
          createdById: data.createdById,
          products: {
            create: data.products.map(product => ({
              productId: product.productId,
              quantity: product.quantity,
            })),
          },
        },
        include: {
          products: true,
        },
      });

      for (const { productId, quantity } of data.products) {
        await transaction.warehouseProduct.updateMany({
          where: {
            warehouseId: data.warehouseId,
            productId: productId,
          },
          data: {
            quantity: {
              decrement: quantity,
            },
          },
        });

        await transaction.product.update({
          where: { id: productId },
          data: {
            availableQty: {
              decrement: quantity,
            },
            sell: {
              increment: quantity,
            },
          },
        });
      }

      return order;
    });

    return result;
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, (error as Error).message);
  }
};

const getAllFromDB = async (
  filters: IEmployeeFilterRequest,
  options: IPaginationOptions,
): Promise<IGenericResponse<Order[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions: Prisma.OrderWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: [
        { invoiceId: { contains: searchTerm, mode: 'insensitive' } },
        { customer: { name: { contains: searchTerm, mode: 'insensitive' } } },
        {
          customer: {
            contactNo: { contains: searchTerm, mode: 'insensitive' },
          },
        },
      ],
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.entries(filterData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const whereConditions: Prisma.OrderWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.order.findMany({
    where: whereConditions,
    include: {
      customer: {
        select: {
          name: true,
        },
      },
      incharge: {
        select: {
          name: true,
        },
      },
      createdBy: {
        select: {
          name: true,
        },
      },
      products: {
        select: {
          product: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            createdAt: 'desc',
          },
  });

  const total = await prisma.order.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result.map(order => ({
      ...order,
      products: order.products.map(op => op.product.name),
    })),
  };
};

const getByIdFromDB = async (id: number): Promise<Order | null> => {
  const result = await prisma.order.findUnique({
    where: {
      id,
    },
  });
  return result;
};

export const orderService = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
};
